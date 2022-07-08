
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class CartService {
    private emitChangeSource = new Subject<any>();

    changeEmitted$ = this.emitChangeSource.asObservable();

    emitChange() {
        this.emitChangeSource.next();
    }
}