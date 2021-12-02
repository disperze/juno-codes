import React from "react"

interface Props {
    readonly totalItems: number;
    readonly step: number;
    readonly onChangePage: (page: number) => void;
}

export default function Pagination({ step, totalItems, onChangePage }: Props): JSX.Element {

    const [enablePrevius, setEnablePrevius] = React.useState<boolean>();
    const [enableNext, setEnableNext] = React.useState<boolean>();
    const [currentPage, setCurrentPage] = React.useState<number>(0);

    const getValidPages = React.useCallback((page: number) => {
        const pages = Math.ceil(totalItems / step);
        if (page <= 1) {
            page = 1;
        } else if (page >= pages) {
            page = pages
        }
        return [page, pages];
    }, [totalItems, step]);

    const calculatePage = React.useCallback((pageNumber: number = 0) => {
        const [page, pages] = getValidPages(pageNumber);
        setEnablePrevius(page > 1);
        setEnableNext(page < pages)
        setCurrentPage(page)
        return page;
    }, [getValidPages])

    React.useEffect(() => {
        calculatePage(currentPage);
    }, [calculatePage, currentPage]);

    const onStepHandle = (page: number) => {
        const validPage = calculatePage(page);
        onChangePage(validPage);
    }
    return (<nav aria-label="Page navigation">
        <ul className="pagination justify-content-end">
            <li className={`page-item ${!enablePrevius ? 'disabled' : ''}`}>
                {/* <button className="page-link" onClick={() => onStepHandle(currentPage - 1)}>Prev</button> */}
                <button type="button" disabled={!enablePrevius} className="btn btn-link" onClick={() => onStepHandle(currentPage - 1)}>Prev</button>
            </li>
            <li className={`page-item ${!enableNext ? 'disabled' : ''}`}>
                {/* <button className="page-link" onClick={() => onStepHandle(currentPage + 1)}>Next</button> */}
                <button type="button" disabled={!enableNext} className="btn btn-link"  onClick={() => onStepHandle(currentPage + 1)}>Next</button>
            </li>
        </ul>
    </nav>)
}
