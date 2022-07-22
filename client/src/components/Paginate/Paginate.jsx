import React from "react";
import style from './Paginate.module.css'

export default function Paginate({ pokesPerPage, allPokes, paginate }) {
    const pages = [];

    for (let i = 0; i <= Math.ceil(allPokes / pokesPerPage); i++) {
        pages.push(i);
    };

    pages.shift()

    return (
        <nav >
            <ul className={style.ulPaginated}>
                {
                    pages && pages.map(page => (
                        <li className={style.paginatedButtons} key={page}>
                            <a className={style.pagButton} onClick={() => paginate(page)}>{page}</a>
                        </li>
                    ))
                }
            </ul>
        </nav>
    )
}