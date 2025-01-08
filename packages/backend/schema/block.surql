////////////////////////
//////// BLOCKS ////////
////////////////////////

DEFINE TABLE block SCHEMAFULL;

DEFINE FIELD id ON block TYPE uuid;
DEFINE FIELD parent ON block TYPE record<page | block>
    READONLY
    REFERENCE ON DELETE CASCADE;
DEFINE FIELD type ON block TYPE string;
DEFINE FIELD props ON block TYPE object;
DEFINE FIELD props.* ON block TYPE bool | number | string;
DEFINE FIELD content ON block FLEXIBLE TYPE option<object | array>;
DEFINE FIELD children ON block TYPE array<record<block>>;
DEFINE FIELD created ON block TYPE datetime READONLY VALUE time::now();
DEFINE FIELD updated ON block TYPE datetime VALUE time::now();


////////////////////////
///////// PAGES ////////
////////////////////////

DEFINE TABLE page SCHEMAFULL
    PERMISSIONS
        FOR create WHERE owner 

DEFINE FIELD name ON user TYPE string;
DEFINE FIELD email ON user TYPE string ASSERT $value.is_email();
DEFINE FIELD created ON user TYPE datetime READONLY VALUE time::now();
DEFINE FIELD updated ON user TYPE datetime VALUE time::now();


////////////////////////
///////// USERS ////////
////////////////////////

DEFINE TABLE user SCHEMAFULL;

DEFINE FIELD name ON user TYPE string;
DEFINE FIELD email ON user TYPE string ASSERT $value.is_email();
DEFINE FIELD created ON user TYPE datetime READONLY VALUE time::now();
DEFINE FIELD updated ON user TYPE datetime VALUE time::now();