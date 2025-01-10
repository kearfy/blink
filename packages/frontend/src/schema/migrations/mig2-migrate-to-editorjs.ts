import { surql } from "surrealdb";

export default surql`
    DEFINE FIELD OVERWRITE content ON page TYPE array<{
        id: string,
        type: string,
        data: object,
    }>;
`;
