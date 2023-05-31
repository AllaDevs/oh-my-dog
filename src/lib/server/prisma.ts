import { dev } from '$app/environment';
import { PrismaClient } from '@prisma/client';


const prisma = globalThis.__prisma || new PrismaClient();

if (dev) {
    globalThis.__prisma = prisma;
}

export { prisma };

/*

Error codes:

- P2002: Unique constraint failed on the {constraint}
- P2003: Foreign key constraint failed on the {field_name}
- P2003: Foreign key constraint failed on the field: {field_name}
- P2004: A constraint failed on the database: {database_error}
- P2005: The value {field_value} stored in the database for the field {field_name} is invalid for the field's type
- P2006: The provided value {field_value} for {model_name} field {field_name} is not valid
- P2007: Data validation error {database_error}
- P2008: Failed to parse the query {query_parsing_error} at {query_position}"
- P2009: Failed to validate the query: {query_validation_error} at {query_position}"
- P2010: Raw query failed. Code: {code}. Message: {message}"
- P2011: Null constraint violation on the {constraint}"
- P2012: Missing a required value at {path}"
- P2013: Missing the required argument {argument_name} for field {field_name} on {object_name}."
- P2014: The change you are trying to make would violate the required relation '{relation_name}' between the {model_a_name} and {model_b_name} models."
- P2015: A related record could not be found. {details}"
- P2016: Query interpretation error. {details}"
- P2017: The records for relation {relation_name} between the {parent_name} and {child_name} models are not connected."
- P2018: The required connected records were not found. {details}"
- P2019: Input error. {details}"
- P2020: Value out of range for the type. {details}"
- P2021: The table {table} does not exist in the current database."
- P2022: The column {column} does not exist in the current database."
- P2023: Inconsistent column data: {message}"
- P2024: Timed out fetching a new connection from the connection pool. (More info: http://pris.ly/d/connection-pool (Current connection pool timeout: {timeout}, connection limit: {connection_limit})"
- P2025: An operation failed because it depends on one or more records that were required but not found. {cause}"
- P2026: The current database provider doesn't support a feature that the query used: {feature}"
- P2027: Multiple errors occurred on the database during query execution: {errors}"
- P2028: Transaction API error: {error}"
- P2030: Cannot find a fulltext index to use for the search, try adding a @@fulltext([Fields...]) to your schema"
- P2031: Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set. See details: https://pris.ly/d/mongodb-replica-set"
- P2033: A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers"
- P2034: Transaction failed due to a write conflict or a deadlock. Please retry your transaction"

*/
