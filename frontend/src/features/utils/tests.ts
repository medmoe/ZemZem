import {MemoryRouter} from "react-router-dom";
import {Queries, RenderOptions} from "@testing-library/react";

export const options = {
        wrapper: MemoryRouter
    } as RenderOptions<Queries, HTMLElement, HTMLElement>