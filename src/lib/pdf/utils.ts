import type { Content } from 'pdfmake/interfaces';


export const reusableContent = {
    'hLine': {
        decorationColor: 'red',
        table: {
            headerRows: 1,
            widths: '*',
            body: [[''], ['']]
        },
        layout: {
            hLineWidth: function (i, node) {
                return (i === 0 || i === node.table.body.length) ? 0 : 1;
            },
            vLineWidth: function (i, node) {
                return 0;
            },
        },
        margin: [0, 4, 0, 4],
    },
} satisfies Record<string, Content>;
