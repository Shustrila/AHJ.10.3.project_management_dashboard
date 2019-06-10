import {of, Subject} from 'rxjs';
class Stream {
    constructor() {
        this.click$ = new Subject();
    }

    subscribeClick() {
        this.click$.subscribe(
            next =>  {
                const {quantity, tasks} = next;

                quantity.innerHTML = tasks.filter(item => !item.done).length;
            },
            error => of(error),
        );
    }
}

export default Stream;
