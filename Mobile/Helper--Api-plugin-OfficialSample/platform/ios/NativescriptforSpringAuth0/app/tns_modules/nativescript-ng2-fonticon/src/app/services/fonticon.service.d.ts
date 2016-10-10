import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export declare class TNSFontIconService {
    filesLoaded: BehaviorSubject<any>;
    css: any;
    private _paths;
    private _currentName;
    private _debug;
    constructor(paths: any, debug?: boolean);
    loadCss(): void;
    private loadFile(path);
    private mapCss(data);
}
