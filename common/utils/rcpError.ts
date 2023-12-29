import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {


        let statusCode = 500;
        let message = '';

        const error = exception.getError();
        if (typeof error === 'object' && error !== null) {
            if ('statusCode' in error) {
                if (typeof error.statusCode === 'number') {
                    statusCode = error.statusCode;
                }
            }
            if ('message' in error) {
                message = error.message as string;
            }
        }

        return {
            statusCode,
            message
        }
    }
}
