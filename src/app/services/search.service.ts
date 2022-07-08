
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class SearchService {
    private emitSearch = new Subject<any>();

    changeEmitted$ = this.emitSearch.asObservable();

    emitChange() {
        this.emitSearch.next();
    }
}