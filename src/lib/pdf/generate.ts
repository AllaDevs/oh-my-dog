import { friendlyDate, friendlyDateARG } from '$lib/utils/functions';
import { te } from '$lib/utils/translateEnums';
import type { Breed, Client, MedicalRecord, RegisteredDog } from '@prisma/client';
import blobStream, { type IBlobStream } from 'blob-stream';
import PdfPrinter from 'pdfmake';
import type { Content, ContentColumns, Style, StyleDictionary, TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import { reusableContent } from './utils';


const fonts: TFontDictionary = {
    Inter: {
        normal: 'src/lib/pdf/assets/Inter-Regular.ttf',
        bold: 'src/lib/pdf/assets/Inter-Bold.ttf',
    },
};

const printer = new PdfPrinter(fonts);


const pdfDefaultStyle = {
    font: 'Inter',
    fontSize: 12,
    color: '#374151',
    bold: false,
} satisfies Style;

const pdfStyles = {
    h1: {
        fontSize: 24,
        bold: true,
        alignment: 'center',
        marginTop: 12,
        color: '#111827'
    },
    h2: {
        fontSize: 18,
        bold: true,
        margin: [0, 10, 0, 8],
        color: '#1f2937'
    },
    h3: {
        fontSize: 16,
        bold: true,
        margin: [0, 8, 0, 6],
        color: '#1f2937'
    },
    p: {
        fontSize: 12,
        marginLeft: 8,
        marginTop: 2,
        color: '#1f2937'
    }
} satisfies StyleDictionary;


function vetPDFHeader(title = 'Historial medico canino') {
    return {
        columns: [
            {
                width: 64,
                image: 'src/lib/pdf/assets/logo.png',
            },
            {
                width: '*',
                text: title, style: 'h1',
            },
            {
                width: 64,
                text: `Emitido ${friendlyDateARG(new Date()).split(',')[0]}`,
                marginTop: 16,
                fontSize: 10,
                alignment: 'right',
            }
        ],
        marginBottom: 16,
    } satisfies ContentColumns;
}


type DogData = (
    RegisteredDog &
    {
        breed: Breed;
        medicalRecord: MedicalRecord[];
        owner: Client;
    }
);

export async function genDogMedicalRecordPDF(dog: DogData): Promise<Blob> {
    const file: TDocumentDefinitions = {
        content: [
            vetPDFHeader(),
            { text: `Informacion del dueño`, style: 'h2' },
            { text: `Nombre y apellido: ${dog.owner.firstname} ${dog.owner.lastname}`, style: 'p' },
            { text: `Telefono: ${dog.owner.phone}`, style: 'p' },
            { text: `Correo: ${dog.owner.email}`, style: 'p' },
            { text: ` `, fontSize: 8 },
            reusableContent.hLine,
            { text: `Informacion del perro`, style: 'h2' },
            { text: `Nombre: ${dog.name}`, style: 'p' },
            { text: `Raza: ${dog.breed.name}`, style: 'p' },
            { text: `Fecha de nacimiento: ${friendlyDateARG(dog.birthdate).split(',')[0]}`, style: 'p' },
            { text: `Sexo: ${te.DogSex(dog.sex)}`, style: 'p' },
            { text: `Color: ${dog.color}`, style: 'p' },
            { text: `Observaciones: ${dog.observation ?? 'Sin observaciones'}`, style: 'p' },
            { text: ` `, fontSize: 8 },
            {
                stack: [
                    { text: `Historial medico`, style: 'h3' },
                    ...(
                        dog.medicalRecord.length === 0
                            ? [{ text: `No tiene visitas registradas`, style: 'p' }]
                            : dog.medicalRecord.map((record) => [
                                { text: `Fecha: ${friendlyDate(record.date)}`, style: 'p' },
                                { text: `Motivo: ${record.reason}`, style: 'p' },
                                { text: `Observacion: ${record.observation}`, style: 'p' },
                            ])
                    )
                ],
                marginLeft: 8,
            }
        ],
        styles: pdfStyles,
        defaultStyle: pdfDefaultStyle,
        info: {
            title: `Historial medico de ${dog.name}`,
            subject: `Este documento contiene la informacion medica de ${dog.name} tanto asi como su historial medico y la informacion de contacto de su dueño.`,
            author: `Veterinaria ¡Oh my dog!`,
            creator: `Veterinaria ¡Oh my dog!`,
            producer: `Veterinaria ¡Oh my dog!`,
        }
    };

    return new Promise((resolve, reject) => {
        const pdf = printer.createPdfKitDocument(file);

        pdf.pipe(blobStream())
            .on(
                'finish',
                function (this: IBlobStream) {
                    resolve(this.toBlob('application/pdf'));
                }
            )
            .on(
                'error',
                function (this: IBlobStream, err: Error) {
                    console.error('PDF generation error', err);
                    reject(err);
                }
            );

        pdf.end();
    });
}


type ClientData = (
    Client &
    {
        dog: (RegisteredDog & {
            breed: Breed;
            medicalRecord: MedicalRecord[];
        })[];
    }
);


function dogContent(dog: ClientData['dog'][0]): Content {
    return [
        { text: ` `, fontSize: 8 },
        reusableContent.hLine,
        { text: `Informacion del perro`, style: 'h2' },
        { text: `Nombre: ${dog.name}`, style: 'p' },
        { text: `Raza: ${dog.breed.name}`, style: 'p' },
        { text: `Fecha de nacimiento: ${friendlyDateARG(dog.birthdate).split(',')[0]}`, style: 'p' },
        { text: `Sexo: ${te.DogSex(dog.sex)}`, style: 'p' },
        { text: `Color: ${dog.color}`, style: 'p' },
        { text: `Observaciones: ${dog.observation ?? 'Sin observaciones'}`, style: 'p' },
        { text: ` `, fontSize: 8 },
        {
            stack: [
                { text: `Historial medico`, style: 'h3' },
                ...(
                    dog.medicalRecord.length === 0
                        ? [{ text: `No tiene visitas registradas`, style: 'p' }]
                        : dog.medicalRecord.map((record) => [
                            { text: `Fecha: ${friendlyDate(record.date)}`, style: 'p' },
                            { text: `Motivo: ${record.reason}`, style: 'p' },
                            { text: `Observacion: ${record.observation}`, style: 'p' },
                        ])
                )
            ],
            marginLeft: 8,
        }
    ];
}

export async function genDogsMedicalRecordPDF(client: ClientData): Promise<Blob> {
    const file: TDocumentDefinitions = {
        content: [
            vetPDFHeader(),
            { text: `Informacion del dueño`, style: 'h2' },
            { text: `Nombre y apellido: ${client.firstname} ${client.lastname}`, style: 'p' },
            { text: `Telefono: ${client.phone}`, style: 'p' },
            { text: `Correo: ${client.email}`, style: 'p' },
            ...client.dog.map((dog) => dogContent(dog))
        ],
        styles: pdfStyles,
        defaultStyle: pdfDefaultStyle,
        info: {
            title: `Historiales medicos de los perros del ${client.firstname} ${client.lastname}`,
            subject: `Este documento contiene la informacion medica de los perros del ${client.firstname} ${client.lastname} tanto asi como sus historiales medicos y la informacion de contacto del dueño.`,
            author: `Veterinaria ¡Oh my dog!`,
            creator: `Veterinaria ¡Oh my dog!`,
            producer: `Veterinaria ¡Oh my dog!`,
        }
    };

    return new Promise((resolve, reject) => {
        const pdf = printer.createPdfKitDocument(file);

        pdf.pipe(blobStream())
            .on(
                'finish',
                function (this: IBlobStream) {
                    resolve(this.toBlob('application/pdf'));
                }
            )
            .on(
                'error',
                function (this: IBlobStream, err: Error) {
                    console.error('PDF generation error', err);
                    reject(err);
                }
            );

        pdf.end();
    });
}