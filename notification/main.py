from fastapi import FastAPI
import pika
from threading import Thread
import os
print(f"Init app")
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
RABBITMQ_PORT = int(os.getenv('RABBITMQ_PORT', 5672))

def connect_rabbitmq():
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST, RABBITMQ_PORT))
        channel = connection.channel()
        return channel
    except Exception as e:
        print(f"Error connecting to RabbitMQ: {e}")
        return None

app = FastAPI()
channel = connect_rabbitmq()

@app.on_event("shutdown")
def disconnect_rabbitmq():
    if channel and channel.is_open:
        channel.close()

@app.get("/")
def read_root():
    if channel:
        try:
            channel.basic_publish(exchange='', routing_key='notifications_queue', body='{"pattern":"notifications_queue","data":{"orderId":1}')
            return {"message": "Message sent to RabbitMQ"}
        except Exception as e:
            return {"error": f"Error sending message to RabbitMQ: {e}"}
    else:
        return {"error": "Not connected to RabbitMQ"}

def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)
    # print(" [x] " + str(properties))
    print(" [x] Done")

def start_consuming():
    if channel:
        try:
            channel.queue_declare(queue='notifications_queue')
            channel.basic_consume(queue='notifications_queue', on_message_callback=callback, auto_ack=True)
            channel.start_consuming()
        except Exception as e:
            print(f"Error consuming messages from RabbitMQ: {e}")

if channel:
    Thread(target=start_consuming).start()