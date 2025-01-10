import { surql } from "surrealdb";

export default surql`
    DEFINE TABLE page SCHEMAFULL;
    DEFINE FIELD title ON page TYPE string;
    DEFINE FIELD favorite ON page TYPE bool DEFAULT false;
    DEFINE FIELD parent ON page TYPE option<record<page>>
        REFERENCE ON DELETE CASCADE;

    DEFINE FIELD content ON page FLEXIBLE TYPE array<object>;
    DEFINE FIELD created ON page VALUE time::now() READONLY;
    DEFINE FIELD updated ON page VALUE time::now();

    DEFINE INDEX compound_favorite ON page FIELDS favorite;
    DEFINE INDEX compound_parent ON page FIELDS parent;
`;
