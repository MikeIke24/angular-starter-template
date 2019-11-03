import {PageableResponseParameters} from './pageable-response-parameters';

export interface PageableDataList<T> extends PageableResponseParameters {
    content: T[];
}

