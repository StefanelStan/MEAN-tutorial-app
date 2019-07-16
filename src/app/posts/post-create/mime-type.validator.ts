import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';
    // generic promise or generic observable
export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
    if (typeof(control.value) === 'string') {
        return of(null); // return observable this is valid
    }
    const file = control.value as File;
    const fileReader = new FileReader();
    // we construct our own observable that reads the fileAsArrayBuffer and when it finished it (loadend) it checks for mime-type
    const frObs = Observable.create((observer: Observer<{[key: string]: any}>) => {
        fileReader.addEventListener('loadend', () => {
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4); // mime-type is stored in 0-4
            let header = '';
            let isValid = false;
            arr.forEach(elem => { // read the hex value of the first 4 elements to determine the mime-type
                header += elem.toString(16);
            });

            switch (header) {
                case '89504e47':
                    isValid = true;
                    break;
                case 'ffd8ffe0':
                case 'ffd8ffe1':
                case 'ffd8ffe2':
                case 'ffd8ffe3':
                case 'ffd8ffe8':
                    isValid = true;
                    break;
                default:
                    isValid = false; // or you can use blob.type as fallback
                    break;
            }

            if(isValid) {
                observer.next(null); // if file is valid we emit Observer with null! That's the rule.
                // If they return something, it's an object with the error
            } else {
                observer.next({ invalidMimeType: true});
            }
            observer.complete(); // to let any subscriber know that we're done
        });
        fileReader.readAsArrayBuffer(file);
    });

    return frObs;
};
