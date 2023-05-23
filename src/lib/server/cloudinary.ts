import { dev } from '$app/environment';
import type { ResolveTypes } from '$lib/utils/types';
import {
    v2 as cloudinary,
    type UploadApiOptions,
    type UploadApiResponse,
    type UploadApiErrorResponse
} from 'cloudinary';
import fs from 'fs';
import { randomUUID } from 'crypto';


const BASE_LOCAL_PATH = 'static/.dev';
const BASE_LOCAL_URL = 'http://localhost:5173/.dev';


cloudinary.config({
    secure: true
});

export { cloudinary };


// https://stackoverflow.com/questions/75355695/how-to-upload-a-file-to-cloudinary-from-page-server
export async function uploadFile(file: File, options: UploadApiOptions) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); //  <-- convert to Buffer

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(options, onDone).end(buffer);

        function onDone(err?: UploadApiErrorResponse, callResult?: UploadApiResponse) {
            if (err) {
                return reject({ success: false, error: err });
            }
            return resolve({ success: true, result: callResult });
        }
    });
}


type UploadImageOptions = ResolveTypes<UploadApiOptions & { asset_folder?: string; }>;

type UploadImageResponse =
    | {
        success: true;
        result: UploadApiResponse;
    }
    | {
        success: false;
        error: UploadApiErrorResponse;
    };


/**
 * Uploads an image to cloudinary
 *
 * use options.asset_folder = 'user' for any user uploaded image
 */
async function uploadImageCloudinary(
    file: File,
    options: UploadImageOptions
): Promise<UploadImageResponse> {
    options.resource_type = 'image';

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); //  <-- convert to Buffer

    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(options, function (error, result) {
                if (error) {
                    return reject({ success: false, error });
                }
                return resolve({ success: true, result: result as UploadApiResponse });
            })
            .end(buffer);
    });
}

/**
 * Uploads an image to cloudinary
 *
 * use options.asset_folder = 'user' for any user uploaded image
 */
async function uploadImageLocal(
    file: File,
    options: UploadImageOptions
): Promise<UploadImageResponse> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const path = `${options.asset_folder ? options.asset_folder + '/' : ''}${options.public_id ? options.public_id : randomUUID()
        }.${file.type.split('/')[1]}`;

    try {
        await fs.promises.writeFile(`${BASE_LOCAL_PATH}/${path}`, buffer);
        return {
            success: true,
            result: {
                url: `${BASE_LOCAL_URL}/${path}`,
                secure_url: `${BASE_LOCAL_URL}/${path}`,
                width: 256,
                height: 256
            } as UploadApiResponse
        };
    } catch (error) {
        switch ((error as NodeJS.ErrnoException)?.code) {
            case 'EACCES':
                console.error(`No se tiene permiso de escritura en el archivo ${path}`);
                return { success: false, error } as any;
            case 'EADDRINUSE':
                console.error(`El puerto ${path} está en uso`);
                return { success: false, error } as any;
            case 'ENOENT':
                console.error(`No existe el archivo o el directorio ${path}`);
                try {
                    await fs.promises.mkdir(
                        `${BASE_LOCAL_PATH}/${path.split('/').slice(0, -1).join('/')}`,
                        {
                            recursive: true
                        }
                    );

                    await fs.promises.writeFile(`${BASE_LOCAL_PATH}/${path}`, buffer);
                    return {
                        success: true,
                        result: {
                            secure_url: `${BASE_LOCAL_URL}/${path}`,
                            url: `${BASE_LOCAL_URL}/${path}`,
                            width: 256,
                            height: 256
                        } as UploadApiResponse
                    };
                } catch (error) {
                    console.error(
                        `No se pudo crear el directorio ${path.split('/').slice(0, -1).join('/')}`
                    );
                    return { success: false, error } as any;
                }
            default:
                console.error(error);
                return { success: false, error } as any;
        }
    }
}


export const uploadImage = dev ? uploadImageLocal : uploadImageCloudinary;
