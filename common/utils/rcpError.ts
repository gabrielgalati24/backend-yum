// import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
// import { RpcException } from '@nestjs/microservices';
// import { response } from 'express';
// import { Observable, throwError } from 'rxjs';

// @Catch(RpcException)
// export class RpcExceptionFilter implements ExceptionFilter<RpcException> {
//     catch(exception: RpcException, host: ArgumentsHost): Observable<any> {


//         const response = ctx.getContext();
//     }
// }
// import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
// import { RpcException } from '@nestjs/microservices';

// @Catch(RpcException)
// export class RpcExceptionFilter implements ExceptionFilter {
//     catch(exception: RpcException, host: ArgumentsHost) {
//         const ctx = host.switchToRpc();
//         const response = ctx.getContext();
//         const error = exception.getError();
//         const status = typeof error === 'object' ? (error as any).statusCode : null;
//         const message = typeof error === 'object' ? (error as any).message : null;

//         response.error(message, null, status);
//     }
// }
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
        // throw new RpcException({ status: statusCode, message: message });
        return {
            statusCode,
            message
        }
    }
}


/////OTRO 

// import { RpcException } from '@nestjs/microservices';

// export class CustomRpcException extends RpcException {
//   constructor(error: string, statusCode: number = 500) {
//     super({
//       statusCode: statusCode,
//       message: error,
//     });
//   }
// }


// import { Injectable } from '@nestjs/common';
// import { CustomRpcException } from './custom-rpc-exception';

// @Injectable()
// export class ProductService {
//   createProduct(product: any) {
//     try {
//       // Lógica para crear el producto
//     } catch (error) {
//       throw new CustomRpcException('No se pudo crear el producto', 500);
//     }
//   }






// import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
// import { RpcException } from '@nestjs/microservices';
// import { Observable, throwError } from 'rxjs';

// @Catch(RpcException)
// export class RpcExceptionFilter implements ExceptionFilter<RpcException> {
//     catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
//         let statusCode = 500;
//         let message = '';

//         const error = exception.getError();
//         if (typeof error === 'object' && error !== null) {
//             if ('statusCode' in error) {
//                 if (typeof error.statusCode === 'number') {
//                     statusCode = error.statusCode;
//                 }
//             }
//             if ('message' in error) {
//                 message = error.message as string;
//             }
//         }

//         throw new RpcException({ status: statusCode, message: message });
//     }
// }