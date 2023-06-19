import toast from 'svelte-french-toast';


type DonationStatus = 'success' | 'failure' | 'cancelled' | undefined;


export function getDonationStatus(url: URL): DonationStatus {
    switch (url.searchParams.get('status')) {
        case 'approved': {
            return 'success';
        }
        case 'rejected': {
            return 'failure';
        }
        case 'cancelled': {
            return 'cancelled';
        }
    };
    return undefined;
}


export function notifyDonationStatus(state: DonationStatus): void {
    if (state === 'success') {
        toast.success('Tu donacion fue registrada con exito!', {
            duration: 5000,
        });
        return;
    }
    if (state === 'cancelled') {
        toast.custom('Se cancelo el proceso de donacion', {
            duration: 5000,
        });
        return;
    }
    if (state === 'failure') {
        toast.error('La donacion no pudo efectuarse', {
            duration: 5000,
        });
        return;
    }
}
