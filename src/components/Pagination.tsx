import React from "react"

interface Props {
    readonly totalItems: number;
    readonly pageSize: number;
}

export default function Pagination({ totalItems, pageSize }: Props): JSX.Element {
    let links = [];
    for (let i = 1; i < Math.ceil(totalItems / pageSize); i++) {
        links.push(<li className="page-item"><a className="page-link" href="#">{i}</a></li>)
    }

    return (<nav aria-label="Page navigation">
        <ul className="pagination justify-content-end">
            <li className="page-item disabled">
                <a className="page-link">Previous</a>
            </li>
            {links}
            <li className="page-item">
                <a className="page-link" href="#">Next</a>
            </li>
        </ul>
    </nav>)
}
