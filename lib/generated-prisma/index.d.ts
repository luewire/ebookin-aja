
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Subscription
 * 
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model Ebook
 * 
 */
export type Ebook = $Result.DefaultSelection<Prisma.$EbookPayload>
/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Banner
 * 
 */
export type Banner = $Result.DefaultSelection<Prisma.$BannerPayload>
/**
 * Model ReadingLog
 * 
 */
export type ReadingLog = $Result.DefaultSelection<Prisma.$ReadingLogPayload>
/**
 * Model AdminEvent
 * 
 */
export type AdminEvent = $Result.DefaultSelection<Prisma.$AdminEventPayload>
/**
 * Model ReadingProgress
 * 
 */
export type ReadingProgress = $Result.DefaultSelection<Prisma.$ReadingProgressPayload>
/**
 * Model Annotation
 * 
 */
export type Annotation = $Result.DefaultSelection<Prisma.$AnnotationPayload>
/**
 * Model Readlist
 * 
 */
export type Readlist = $Result.DefaultSelection<Prisma.$ReadlistPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const SubscriptionStatus: {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
  PENDING: 'PENDING'
};

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]


export const TransactionStatus: {
  PENDING: 'PENDING',
  SETTLEMENT: 'SETTLEMENT',
  EXPIRE: 'EXPIRE',
  CANCEL: 'CANCEL',
  DENY: 'DENY'
};

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus]


export const ReadlistStatus: {
  WANT_TO_READ: 'WANT_TO_READ',
  READING: 'READING',
  FINISHED: 'FINISHED'
};

export type ReadlistStatus = (typeof ReadlistStatus)[keyof typeof ReadlistStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type SubscriptionStatus = $Enums.SubscriptionStatus

export const SubscriptionStatus: typeof $Enums.SubscriptionStatus

export type TransactionStatus = $Enums.TransactionStatus

export const TransactionStatus: typeof $Enums.TransactionStatus

export type ReadlistStatus = $Enums.ReadlistStatus

export const ReadlistStatus: typeof $Enums.ReadlistStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscription.findMany()
    * ```
    */
  get subscription(): Prisma.SubscriptionDelegate<ExtArgs>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs>;

  /**
   * `prisma.ebook`: Exposes CRUD operations for the **Ebook** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ebooks
    * const ebooks = await prisma.ebook.findMany()
    * ```
    */
  get ebook(): Prisma.EbookDelegate<ExtArgs>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs>;

  /**
   * `prisma.banner`: Exposes CRUD operations for the **Banner** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Banners
    * const banners = await prisma.banner.findMany()
    * ```
    */
  get banner(): Prisma.BannerDelegate<ExtArgs>;

  /**
   * `prisma.readingLog`: Exposes CRUD operations for the **ReadingLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReadingLogs
    * const readingLogs = await prisma.readingLog.findMany()
    * ```
    */
  get readingLog(): Prisma.ReadingLogDelegate<ExtArgs>;

  /**
   * `prisma.adminEvent`: Exposes CRUD operations for the **AdminEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminEvents
    * const adminEvents = await prisma.adminEvent.findMany()
    * ```
    */
  get adminEvent(): Prisma.AdminEventDelegate<ExtArgs>;

  /**
   * `prisma.readingProgress`: Exposes CRUD operations for the **ReadingProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReadingProgresses
    * const readingProgresses = await prisma.readingProgress.findMany()
    * ```
    */
  get readingProgress(): Prisma.ReadingProgressDelegate<ExtArgs>;

  /**
   * `prisma.annotation`: Exposes CRUD operations for the **Annotation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Annotations
    * const annotations = await prisma.annotation.findMany()
    * ```
    */
  get annotation(): Prisma.AnnotationDelegate<ExtArgs>;

  /**
   * `prisma.readlist`: Exposes CRUD operations for the **Readlist** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Readlists
    * const readlists = await prisma.readlist.findMany()
    * ```
    */
  get readlist(): Prisma.ReadlistDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Subscription: 'Subscription',
    Transaction: 'Transaction',
    Ebook: 'Ebook',
    Category: 'Category',
    Banner: 'Banner',
    ReadingLog: 'ReadingLog',
    AdminEvent: 'AdminEvent',
    ReadingProgress: 'ReadingProgress',
    Annotation: 'Annotation',
    Readlist: 'Readlist'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "subscription" | "transaction" | "ebook" | "category" | "banner" | "readingLog" | "adminEvent" | "readingProgress" | "annotation" | "readlist"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Subscription: {
        payload: Prisma.$SubscriptionPayload<ExtArgs>
        fields: Prisma.SubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findMany: {
            args: Prisma.SubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          create: {
            args: Prisma.SubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          createMany: {
            args: Prisma.SubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          update: {
            args: Prisma.SubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscription>
          }
          groupBy: {
            args: Prisma.SubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      Ebook: {
        payload: Prisma.$EbookPayload<ExtArgs>
        fields: Prisma.EbookFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EbookFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EbookPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EbookFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EbookPayload>
          }
          findFirst: {
            args: Prisma.EbookFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EbookPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EbookFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EbookPayload>
          }
          findMany: {
            args: Prisma.EbookFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EbookPayload>[]
          }
          create: {
            args: Prisma.EbookCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EbookPayload>
          }
          createMany: {
            args: Prisma.EbookCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EbookCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EbookPayload>[]
          }
          delete: {
            args: Prisma.EbookDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EbookPayload>
          }
          update: {
            args: Prisma.EbookUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EbookPayload>
          }
          deleteMany: {
            args: Prisma.EbookDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EbookUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EbookUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EbookPayload>
          }
          aggregate: {
            args: Prisma.EbookAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEbook>
          }
          groupBy: {
            args: Prisma.EbookGroupByArgs<ExtArgs>
            result: $Utils.Optional<EbookGroupByOutputType>[]
          }
          count: {
            args: Prisma.EbookCountArgs<ExtArgs>
            result: $Utils.Optional<EbookCountAggregateOutputType> | number
          }
        }
      }
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Banner: {
        payload: Prisma.$BannerPayload<ExtArgs>
        fields: Prisma.BannerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BannerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BannerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannerPayload>
          }
          findFirst: {
            args: Prisma.BannerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BannerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannerPayload>
          }
          findMany: {
            args: Prisma.BannerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannerPayload>[]
          }
          create: {
            args: Prisma.BannerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannerPayload>
          }
          createMany: {
            args: Prisma.BannerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BannerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannerPayload>[]
          }
          delete: {
            args: Prisma.BannerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannerPayload>
          }
          update: {
            args: Prisma.BannerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannerPayload>
          }
          deleteMany: {
            args: Prisma.BannerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BannerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BannerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannerPayload>
          }
          aggregate: {
            args: Prisma.BannerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBanner>
          }
          groupBy: {
            args: Prisma.BannerGroupByArgs<ExtArgs>
            result: $Utils.Optional<BannerGroupByOutputType>[]
          }
          count: {
            args: Prisma.BannerCountArgs<ExtArgs>
            result: $Utils.Optional<BannerCountAggregateOutputType> | number
          }
        }
      }
      ReadingLog: {
        payload: Prisma.$ReadingLogPayload<ExtArgs>
        fields: Prisma.ReadingLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReadingLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReadingLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingLogPayload>
          }
          findFirst: {
            args: Prisma.ReadingLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReadingLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingLogPayload>
          }
          findMany: {
            args: Prisma.ReadingLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingLogPayload>[]
          }
          create: {
            args: Prisma.ReadingLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingLogPayload>
          }
          createMany: {
            args: Prisma.ReadingLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReadingLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingLogPayload>[]
          }
          delete: {
            args: Prisma.ReadingLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingLogPayload>
          }
          update: {
            args: Prisma.ReadingLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingLogPayload>
          }
          deleteMany: {
            args: Prisma.ReadingLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReadingLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReadingLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingLogPayload>
          }
          aggregate: {
            args: Prisma.ReadingLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReadingLog>
          }
          groupBy: {
            args: Prisma.ReadingLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReadingLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReadingLogCountArgs<ExtArgs>
            result: $Utils.Optional<ReadingLogCountAggregateOutputType> | number
          }
        }
      }
      AdminEvent: {
        payload: Prisma.$AdminEventPayload<ExtArgs>
        fields: Prisma.AdminEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminEventPayload>
          }
          findFirst: {
            args: Prisma.AdminEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminEventPayload>
          }
          findMany: {
            args: Prisma.AdminEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminEventPayload>[]
          }
          create: {
            args: Prisma.AdminEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminEventPayload>
          }
          createMany: {
            args: Prisma.AdminEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminEventPayload>[]
          }
          delete: {
            args: Prisma.AdminEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminEventPayload>
          }
          update: {
            args: Prisma.AdminEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminEventPayload>
          }
          deleteMany: {
            args: Prisma.AdminEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AdminEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminEventPayload>
          }
          aggregate: {
            args: Prisma.AdminEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdminEvent>
          }
          groupBy: {
            args: Prisma.AdminEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminEventCountArgs<ExtArgs>
            result: $Utils.Optional<AdminEventCountAggregateOutputType> | number
          }
        }
      }
      ReadingProgress: {
        payload: Prisma.$ReadingProgressPayload<ExtArgs>
        fields: Prisma.ReadingProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReadingProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReadingProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>
          }
          findFirst: {
            args: Prisma.ReadingProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReadingProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>
          }
          findMany: {
            args: Prisma.ReadingProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>[]
          }
          create: {
            args: Prisma.ReadingProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>
          }
          createMany: {
            args: Prisma.ReadingProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReadingProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>[]
          }
          delete: {
            args: Prisma.ReadingProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>
          }
          update: {
            args: Prisma.ReadingProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>
          }
          deleteMany: {
            args: Prisma.ReadingProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReadingProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReadingProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>
          }
          aggregate: {
            args: Prisma.ReadingProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReadingProgress>
          }
          groupBy: {
            args: Prisma.ReadingProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReadingProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReadingProgressCountArgs<ExtArgs>
            result: $Utils.Optional<ReadingProgressCountAggregateOutputType> | number
          }
        }
      }
      Annotation: {
        payload: Prisma.$AnnotationPayload<ExtArgs>
        fields: Prisma.AnnotationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnnotationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnotationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnnotationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnotationPayload>
          }
          findFirst: {
            args: Prisma.AnnotationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnotationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnnotationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnotationPayload>
          }
          findMany: {
            args: Prisma.AnnotationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnotationPayload>[]
          }
          create: {
            args: Prisma.AnnotationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnotationPayload>
          }
          createMany: {
            args: Prisma.AnnotationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnnotationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnotationPayload>[]
          }
          delete: {
            args: Prisma.AnnotationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnotationPayload>
          }
          update: {
            args: Prisma.AnnotationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnotationPayload>
          }
          deleteMany: {
            args: Prisma.AnnotationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnnotationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AnnotationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnotationPayload>
          }
          aggregate: {
            args: Prisma.AnnotationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnnotation>
          }
          groupBy: {
            args: Prisma.AnnotationGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnnotationGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnnotationCountArgs<ExtArgs>
            result: $Utils.Optional<AnnotationCountAggregateOutputType> | number
          }
        }
      }
      Readlist: {
        payload: Prisma.$ReadlistPayload<ExtArgs>
        fields: Prisma.ReadlistFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReadlistFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadlistPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReadlistFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadlistPayload>
          }
          findFirst: {
            args: Prisma.ReadlistFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadlistPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReadlistFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadlistPayload>
          }
          findMany: {
            args: Prisma.ReadlistFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadlistPayload>[]
          }
          create: {
            args: Prisma.ReadlistCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadlistPayload>
          }
          createMany: {
            args: Prisma.ReadlistCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReadlistCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadlistPayload>[]
          }
          delete: {
            args: Prisma.ReadlistDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadlistPayload>
          }
          update: {
            args: Prisma.ReadlistUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadlistPayload>
          }
          deleteMany: {
            args: Prisma.ReadlistDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReadlistUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReadlistUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadlistPayload>
          }
          aggregate: {
            args: Prisma.ReadlistAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReadlist>
          }
          groupBy: {
            args: Prisma.ReadlistGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReadlistGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReadlistCountArgs<ExtArgs>
            result: $Utils.Optional<ReadlistCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    readingLogs: number
    readingProgress: number
    readlist: number
    annotations: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    readingLogs?: boolean | UserCountOutputTypeCountReadingLogsArgs
    readingProgress?: boolean | UserCountOutputTypeCountReadingProgressArgs
    readlist?: boolean | UserCountOutputTypeCountReadlistArgs
    annotations?: boolean | UserCountOutputTypeCountAnnotationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReadingLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadingLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReadingProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadingProgressWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReadlistArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadlistWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAnnotationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnnotationWhereInput
  }


  /**
   * Count Type SubscriptionCountOutputType
   */

  export type SubscriptionCountOutputType = {
    transactions: number
  }

  export type SubscriptionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | SubscriptionCountOutputTypeCountTransactionsArgs
  }

  // Custom InputTypes
  /**
   * SubscriptionCountOutputType without action
   */
  export type SubscriptionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionCountOutputType
     */
    select?: SubscriptionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SubscriptionCountOutputType without action
   */
  export type SubscriptionCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }


  /**
   * Count Type EbookCountOutputType
   */

  export type EbookCountOutputType = {
    readingLogs: number
    readingProgress: number
    readlist: number
    annotations: number
  }

  export type EbookCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    readingLogs?: boolean | EbookCountOutputTypeCountReadingLogsArgs
    readingProgress?: boolean | EbookCountOutputTypeCountReadingProgressArgs
    readlist?: boolean | EbookCountOutputTypeCountReadlistArgs
    annotations?: boolean | EbookCountOutputTypeCountAnnotationsArgs
  }

  // Custom InputTypes
  /**
   * EbookCountOutputType without action
   */
  export type EbookCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EbookCountOutputType
     */
    select?: EbookCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EbookCountOutputType without action
   */
  export type EbookCountOutputTypeCountReadingLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadingLogWhereInput
  }

  /**
   * EbookCountOutputType without action
   */
  export type EbookCountOutputTypeCountReadingProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadingProgressWhereInput
  }

  /**
   * EbookCountOutputType without action
   */
  export type EbookCountOutputTypeCountReadlistArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadlistWhereInput
  }

  /**
   * EbookCountOutputType without action
   */
  export type EbookCountOutputTypeCountAnnotationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnnotationWhereInput
  }


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    ebooks: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ebooks?: boolean | CategoryCountOutputTypeCountEbooksArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountEbooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EbookWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    firebaseUid: string | null
    email: string | null
    name: string | null
    photoUrl: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    firebaseUid: string | null
    email: string | null
    name: string | null
    photoUrl: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    firebaseUid: number
    email: number
    name: number
    photoUrl: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    firebaseUid?: true
    email?: true
    name?: true
    photoUrl?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    firebaseUid?: true
    email?: true
    name?: true
    photoUrl?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    firebaseUid?: true
    email?: true
    name?: true
    photoUrl?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    firebaseUid: string
    email: string
    name: string | null
    photoUrl: string | null
    role: $Enums.UserRole
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firebaseUid?: boolean
    email?: boolean
    name?: boolean
    photoUrl?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    readingLogs?: boolean | User$readingLogsArgs<ExtArgs>
    readingProgress?: boolean | User$readingProgressArgs<ExtArgs>
    readlist?: boolean | User$readlistArgs<ExtArgs>
    subscription?: boolean | User$subscriptionArgs<ExtArgs>
    annotations?: boolean | User$annotationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firebaseUid?: boolean
    email?: boolean
    name?: boolean
    photoUrl?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    firebaseUid?: boolean
    email?: boolean
    name?: boolean
    photoUrl?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    readingLogs?: boolean | User$readingLogsArgs<ExtArgs>
    readingProgress?: boolean | User$readingProgressArgs<ExtArgs>
    readlist?: boolean | User$readlistArgs<ExtArgs>
    subscription?: boolean | User$subscriptionArgs<ExtArgs>
    annotations?: boolean | User$annotationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      readingLogs: Prisma.$ReadingLogPayload<ExtArgs>[]
      readingProgress: Prisma.$ReadingProgressPayload<ExtArgs>[]
      readlist: Prisma.$ReadlistPayload<ExtArgs>[]
      subscription: Prisma.$SubscriptionPayload<ExtArgs> | null
      annotations: Prisma.$AnnotationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      firebaseUid: string
      email: string
      name: string | null
      photoUrl: string | null
      role: $Enums.UserRole
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    readingLogs<T extends User$readingLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$readingLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingLogPayload<ExtArgs>, T, "findMany"> | Null>
    readingProgress<T extends User$readingProgressArgs<ExtArgs> = {}>(args?: Subset<T, User$readingProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "findMany"> | Null>
    readlist<T extends User$readlistArgs<ExtArgs> = {}>(args?: Subset<T, User$readlistArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadlistPayload<ExtArgs>, T, "findMany"> | Null>
    subscription<T extends User$subscriptionArgs<ExtArgs> = {}>(args?: Subset<T, User$subscriptionArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    annotations<T extends User$annotationsArgs<ExtArgs> = {}>(args?: Subset<T, User$annotationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnotationPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly firebaseUid: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly photoUrl: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.readingLogs
   */
  export type User$readingLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingLog
     */
    select?: ReadingLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingLogInclude<ExtArgs> | null
    where?: ReadingLogWhereInput
    orderBy?: ReadingLogOrderByWithRelationInput | ReadingLogOrderByWithRelationInput[]
    cursor?: ReadingLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReadingLogScalarFieldEnum | ReadingLogScalarFieldEnum[]
  }

  /**
   * User.readingProgress
   */
  export type User$readingProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    where?: ReadingProgressWhereInput
    orderBy?: ReadingProgressOrderByWithRelationInput | ReadingProgressOrderByWithRelationInput[]
    cursor?: ReadingProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReadingProgressScalarFieldEnum | ReadingProgressScalarFieldEnum[]
  }

  /**
   * User.readlist
   */
  export type User$readlistArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Readlist
     */
    select?: ReadlistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadlistInclude<ExtArgs> | null
    where?: ReadlistWhereInput
    orderBy?: ReadlistOrderByWithRelationInput | ReadlistOrderByWithRelationInput[]
    cursor?: ReadlistWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReadlistScalarFieldEnum | ReadlistScalarFieldEnum[]
  }

  /**
   * User.subscription
   */
  export type User$subscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
  }

  /**
   * User.annotations
   */
  export type User$annotationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Annotation
     */
    select?: AnnotationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnotationInclude<ExtArgs> | null
    where?: AnnotationWhereInput
    orderBy?: AnnotationOrderByWithRelationInput | AnnotationOrderByWithRelationInput[]
    cursor?: AnnotationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnnotationScalarFieldEnum | AnnotationScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _avg: SubscriptionAvgAggregateOutputType | null
    _sum: SubscriptionSumAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionAvgAggregateOutputType = {
    grossAmount: number | null
  }

  export type SubscriptionSumAggregateOutputType = {
    grossAmount: number | null
  }

  export type SubscriptionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    status: $Enums.SubscriptionStatus | null
    planName: string | null
    startDate: Date | null
    endDate: Date | null
    orderId: string | null
    transactionId: string | null
    grossAmount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    status: $Enums.SubscriptionStatus | null
    planName: string | null
    startDate: Date | null
    endDate: Date | null
    orderId: string | null
    transactionId: string | null
    grossAmount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionCountAggregateOutputType = {
    id: number
    userId: number
    status: number
    planName: number
    startDate: number
    endDate: number
    orderId: number
    transactionId: number
    grossAmount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SubscriptionAvgAggregateInputType = {
    grossAmount?: true
  }

  export type SubscriptionSumAggregateInputType = {
    grossAmount?: true
  }

  export type SubscriptionMinAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    planName?: true
    startDate?: true
    endDate?: true
    orderId?: true
    transactionId?: true
    grossAmount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    planName?: true
    startDate?: true
    endDate?: true
    orderId?: true
    transactionId?: true
    grossAmount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionCountAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    planName?: true
    startDate?: true
    endDate?: true
    orderId?: true
    transactionId?: true
    grossAmount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscription to aggregate.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubscriptionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubscriptionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionMaxAggregateInputType
  }

  export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>
  }




  export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithAggregationInput | SubscriptionOrderByWithAggregationInput[]
    by: SubscriptionScalarFieldEnum[] | SubscriptionScalarFieldEnum
    having?: SubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionCountAggregateInputType | true
    _avg?: SubscriptionAvgAggregateInputType
    _sum?: SubscriptionSumAggregateInputType
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }

  export type SubscriptionGroupByOutputType = {
    id: string
    userId: string
    status: $Enums.SubscriptionStatus
    planName: string
    startDate: Date | null
    endDate: Date | null
    orderId: string | null
    transactionId: string | null
    grossAmount: number | null
    createdAt: Date
    updatedAt: Date
    _count: SubscriptionCountAggregateOutputType | null
    _avg: SubscriptionAvgAggregateOutputType | null
    _sum: SubscriptionSumAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    planName?: boolean
    startDate?: boolean
    endDate?: boolean
    orderId?: boolean
    transactionId?: boolean
    grossAmount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    transactions?: boolean | Subscription$transactionsArgs<ExtArgs>
    _count?: boolean | SubscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    planName?: boolean
    startDate?: boolean
    endDate?: boolean
    orderId?: boolean
    transactionId?: boolean
    grossAmount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectScalar = {
    id?: boolean
    userId?: boolean
    status?: boolean
    planName?: boolean
    startDate?: boolean
    endDate?: boolean
    orderId?: boolean
    transactionId?: boolean
    grossAmount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    transactions?: boolean | Subscription$transactionsArgs<ExtArgs>
    _count?: boolean | SubscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscription"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      status: $Enums.SubscriptionStatus
      planName: string
      startDate: Date | null
      endDate: Date | null
      orderId: string | null
      transactionId: string | null
      grossAmount: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["subscription"]>
    composites: {}
  }

  type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPayload, S>

  type SubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SubscriptionCountAggregateInputType | true
    }

  export interface SubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscription'], meta: { name: 'Subscription' } }
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionFindUniqueArgs>(args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Subscription that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionFindFirstArgs>(args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Subscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionFindManyArgs>(args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     * 
     */
    create<T extends SubscriptionCreateArgs>(args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Subscriptions.
     * @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionCreateManyArgs>(args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subscriptions and returns the data saved in the database.
     * @param {SubscriptionCreateManyAndReturnArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionDeleteArgs>(args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionUpdateArgs>(args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionUpdateManyArgs>(args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionUpsertArgs>(args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subscription model
   */
  readonly fields: SubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    transactions<T extends Subscription$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, Subscription$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subscription model
   */ 
  interface SubscriptionFieldRefs {
    readonly id: FieldRef<"Subscription", 'String'>
    readonly userId: FieldRef<"Subscription", 'String'>
    readonly status: FieldRef<"Subscription", 'SubscriptionStatus'>
    readonly planName: FieldRef<"Subscription", 'String'>
    readonly startDate: FieldRef<"Subscription", 'DateTime'>
    readonly endDate: FieldRef<"Subscription", 'DateTime'>
    readonly orderId: FieldRef<"Subscription", 'String'>
    readonly transactionId: FieldRef<"Subscription", 'String'>
    readonly grossAmount: FieldRef<"Subscription", 'Int'>
    readonly createdAt: FieldRef<"Subscription", 'DateTime'>
    readonly updatedAt: FieldRef<"Subscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Subscription findUnique
   */
  export type SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findUniqueOrThrow
   */
  export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findFirst
   */
  export type SubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findFirstOrThrow
   */
  export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscription.
     */
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
  }

  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subscription createManyAndReturn
   */
  export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscription.
     */
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
    /**
     * Choose, which Subscription to update.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
  }

  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscription to update in case it exists.
     */
    where: SubscriptionWhereUniqueInput
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     */
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
  }

  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter which Subscription to delete.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionWhereInput
  }

  /**
   * Subscription.transactions
   */
  export type Subscription$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Subscription without action
   */
  export type SubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    grossAmount: number | null
  }

  export type TransactionSumAggregateOutputType = {
    grossAmount: number | null
  }

  export type TransactionMinAggregateOutputType = {
    id: string | null
    subscriptionId: string | null
    orderId: string | null
    transactionStatus: $Enums.TransactionStatus | null
    grossAmount: number | null
    paymentType: string | null
    transactionTime: Date | null
    settlementTime: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: string | null
    subscriptionId: string | null
    orderId: string | null
    transactionStatus: $Enums.TransactionStatus | null
    grossAmount: number | null
    paymentType: string | null
    transactionTime: Date | null
    settlementTime: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    subscriptionId: number
    orderId: number
    transactionStatus: number
    grossAmount: number
    paymentType: number
    transactionTime: number
    settlementTime: number
    webhookPayload: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    grossAmount?: true
  }

  export type TransactionSumAggregateInputType = {
    grossAmount?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    subscriptionId?: true
    orderId?: true
    transactionStatus?: true
    grossAmount?: true
    paymentType?: true
    transactionTime?: true
    settlementTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    subscriptionId?: true
    orderId?: true
    transactionStatus?: true
    grossAmount?: true
    paymentType?: true
    transactionTime?: true
    settlementTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    subscriptionId?: true
    orderId?: true
    transactionStatus?: true
    grossAmount?: true
    paymentType?: true
    transactionTime?: true
    settlementTime?: true
    webhookPayload?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: string
    subscriptionId: string
    orderId: string
    transactionStatus: $Enums.TransactionStatus
    grossAmount: number
    paymentType: string | null
    transactionTime: Date | null
    settlementTime: Date | null
    webhookPayload: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subscriptionId?: boolean
    orderId?: boolean
    transactionStatus?: boolean
    grossAmount?: boolean
    paymentType?: boolean
    transactionTime?: boolean
    settlementTime?: boolean
    webhookPayload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    subscription?: boolean | SubscriptionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subscriptionId?: boolean
    orderId?: boolean
    transactionStatus?: boolean
    grossAmount?: boolean
    paymentType?: boolean
    transactionTime?: boolean
    settlementTime?: boolean
    webhookPayload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    subscription?: boolean | SubscriptionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectScalar = {
    id?: boolean
    subscriptionId?: boolean
    orderId?: boolean
    transactionStatus?: boolean
    grossAmount?: boolean
    paymentType?: boolean
    transactionTime?: boolean
    settlementTime?: boolean
    webhookPayload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscription?: boolean | SubscriptionDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscription?: boolean | SubscriptionDefaultArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      subscription: Prisma.$SubscriptionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      subscriptionId: string
      orderId: string
      transactionStatus: $Enums.TransactionStatus
      grossAmount: number
      paymentType: string | null
      transactionTime: Date | null
      settlementTime: Date | null
      webhookPayload: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subscription<T extends SubscriptionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionDefaultArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transaction model
   */ 
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'String'>
    readonly subscriptionId: FieldRef<"Transaction", 'String'>
    readonly orderId: FieldRef<"Transaction", 'String'>
    readonly transactionStatus: FieldRef<"Transaction", 'TransactionStatus'>
    readonly grossAmount: FieldRef<"Transaction", 'Int'>
    readonly paymentType: FieldRef<"Transaction", 'String'>
    readonly transactionTime: FieldRef<"Transaction", 'DateTime'>
    readonly settlementTime: FieldRef<"Transaction", 'DateTime'>
    readonly webhookPayload: FieldRef<"Transaction", 'Json'>
    readonly createdAt: FieldRef<"Transaction", 'DateTime'>
    readonly updatedAt: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Model Ebook
   */

  export type AggregateEbook = {
    _count: EbookCountAggregateOutputType | null
    _avg: EbookAvgAggregateOutputType | null
    _sum: EbookSumAggregateOutputType | null
    _min: EbookMinAggregateOutputType | null
    _max: EbookMaxAggregateOutputType | null
  }

  export type EbookAvgAggregateOutputType = {
    categoryId: number | null
    priority: number | null
  }

  export type EbookSumAggregateOutputType = {
    categoryId: number | null
    priority: number | null
  }

  export type EbookMinAggregateOutputType = {
    id: string | null
    title: string | null
    author: string | null
    description: string | null
    coverUrl: string | null
    pdfUrl: string | null
    publicId: string | null
    category: string | null
    categoryId: number | null
    isPremium: boolean | null
    isActive: boolean | null
    priority: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EbookMaxAggregateOutputType = {
    id: string | null
    title: string | null
    author: string | null
    description: string | null
    coverUrl: string | null
    pdfUrl: string | null
    publicId: string | null
    category: string | null
    categoryId: number | null
    isPremium: boolean | null
    isActive: boolean | null
    priority: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EbookCountAggregateOutputType = {
    id: number
    title: number
    author: number
    description: number
    coverUrl: number
    pdfUrl: number
    publicId: number
    category: number
    categoryId: number
    isPremium: number
    isActive: number
    priority: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EbookAvgAggregateInputType = {
    categoryId?: true
    priority?: true
  }

  export type EbookSumAggregateInputType = {
    categoryId?: true
    priority?: true
  }

  export type EbookMinAggregateInputType = {
    id?: true
    title?: true
    author?: true
    description?: true
    coverUrl?: true
    pdfUrl?: true
    publicId?: true
    category?: true
    categoryId?: true
    isPremium?: true
    isActive?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EbookMaxAggregateInputType = {
    id?: true
    title?: true
    author?: true
    description?: true
    coverUrl?: true
    pdfUrl?: true
    publicId?: true
    category?: true
    categoryId?: true
    isPremium?: true
    isActive?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EbookCountAggregateInputType = {
    id?: true
    title?: true
    author?: true
    description?: true
    coverUrl?: true
    pdfUrl?: true
    publicId?: true
    category?: true
    categoryId?: true
    isPremium?: true
    isActive?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EbookAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ebook to aggregate.
     */
    where?: EbookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ebooks to fetch.
     */
    orderBy?: EbookOrderByWithRelationInput | EbookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EbookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ebooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ebooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ebooks
    **/
    _count?: true | EbookCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EbookAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EbookSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EbookMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EbookMaxAggregateInputType
  }

  export type GetEbookAggregateType<T extends EbookAggregateArgs> = {
        [P in keyof T & keyof AggregateEbook]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEbook[P]>
      : GetScalarType<T[P], AggregateEbook[P]>
  }




  export type EbookGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EbookWhereInput
    orderBy?: EbookOrderByWithAggregationInput | EbookOrderByWithAggregationInput[]
    by: EbookScalarFieldEnum[] | EbookScalarFieldEnum
    having?: EbookScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EbookCountAggregateInputType | true
    _avg?: EbookAvgAggregateInputType
    _sum?: EbookSumAggregateInputType
    _min?: EbookMinAggregateInputType
    _max?: EbookMaxAggregateInputType
  }

  export type EbookGroupByOutputType = {
    id: string
    title: string
    author: string
    description: string | null
    coverUrl: string | null
    pdfUrl: string | null
    publicId: string | null
    category: string
    categoryId: number | null
    isPremium: boolean
    isActive: boolean
    priority: number
    createdAt: Date
    updatedAt: Date
    _count: EbookCountAggregateOutputType | null
    _avg: EbookAvgAggregateOutputType | null
    _sum: EbookSumAggregateOutputType | null
    _min: EbookMinAggregateOutputType | null
    _max: EbookMaxAggregateOutputType | null
  }

  type GetEbookGroupByPayload<T extends EbookGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EbookGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EbookGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EbookGroupByOutputType[P]>
            : GetScalarType<T[P], EbookGroupByOutputType[P]>
        }
      >
    >


  export type EbookSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    author?: boolean
    description?: boolean
    coverUrl?: boolean
    pdfUrl?: boolean
    publicId?: boolean
    category?: boolean
    categoryId?: boolean
    isPremium?: boolean
    isActive?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    readingLogs?: boolean | Ebook$readingLogsArgs<ExtArgs>
    readingProgress?: boolean | Ebook$readingProgressArgs<ExtArgs>
    readlist?: boolean | Ebook$readlistArgs<ExtArgs>
    annotations?: boolean | Ebook$annotationsArgs<ExtArgs>
    categoryRel?: boolean | Ebook$categoryRelArgs<ExtArgs>
    _count?: boolean | EbookCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ebook"]>

  export type EbookSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    author?: boolean
    description?: boolean
    coverUrl?: boolean
    pdfUrl?: boolean
    publicId?: boolean
    category?: boolean
    categoryId?: boolean
    isPremium?: boolean
    isActive?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    categoryRel?: boolean | Ebook$categoryRelArgs<ExtArgs>
  }, ExtArgs["result"]["ebook"]>

  export type EbookSelectScalar = {
    id?: boolean
    title?: boolean
    author?: boolean
    description?: boolean
    coverUrl?: boolean
    pdfUrl?: boolean
    publicId?: boolean
    category?: boolean
    categoryId?: boolean
    isPremium?: boolean
    isActive?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EbookInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    readingLogs?: boolean | Ebook$readingLogsArgs<ExtArgs>
    readingProgress?: boolean | Ebook$readingProgressArgs<ExtArgs>
    readlist?: boolean | Ebook$readlistArgs<ExtArgs>
    annotations?: boolean | Ebook$annotationsArgs<ExtArgs>
    categoryRel?: boolean | Ebook$categoryRelArgs<ExtArgs>
    _count?: boolean | EbookCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EbookIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categoryRel?: boolean | Ebook$categoryRelArgs<ExtArgs>
  }

  export type $EbookPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ebook"
    objects: {
      readingLogs: Prisma.$ReadingLogPayload<ExtArgs>[]
      readingProgress: Prisma.$ReadingProgressPayload<ExtArgs>[]
      readlist: Prisma.$ReadlistPayload<ExtArgs>[]
      annotations: Prisma.$AnnotationPayload<ExtArgs>[]
      categoryRel: Prisma.$CategoryPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      author: string
      description: string | null
      coverUrl: string | null
      pdfUrl: string | null
      publicId: string | null
      category: string
      categoryId: number | null
      isPremium: boolean
      isActive: boolean
      priority: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ebook"]>
    composites: {}
  }

  type EbookGetPayload<S extends boolean | null | undefined | EbookDefaultArgs> = $Result.GetResult<Prisma.$EbookPayload, S>

  type EbookCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EbookFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EbookCountAggregateInputType | true
    }

  export interface EbookDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ebook'], meta: { name: 'Ebook' } }
    /**
     * Find zero or one Ebook that matches the filter.
     * @param {EbookFindUniqueArgs} args - Arguments to find a Ebook
     * @example
     * // Get one Ebook
     * const ebook = await prisma.ebook.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EbookFindUniqueArgs>(args: SelectSubset<T, EbookFindUniqueArgs<ExtArgs>>): Prisma__EbookClient<$Result.GetResult<Prisma.$EbookPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Ebook that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EbookFindUniqueOrThrowArgs} args - Arguments to find a Ebook
     * @example
     * // Get one Ebook
     * const ebook = await prisma.ebook.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EbookFindUniqueOrThrowArgs>(args: SelectSubset<T, EbookFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EbookClient<$Result.GetResult<Prisma.$EbookPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Ebook that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EbookFindFirstArgs} args - Arguments to find a Ebook
     * @example
     * // Get one Ebook
     * const ebook = await prisma.ebook.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EbookFindFirstArgs>(args?: SelectSubset<T, EbookFindFirstArgs<ExtArgs>>): Prisma__EbookClient<$Result.GetResult<Prisma.$EbookPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Ebook that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EbookFindFirstOrThrowArgs} args - Arguments to find a Ebook
     * @example
     * // Get one Ebook
     * const ebook = await prisma.ebook.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EbookFindFirstOrThrowArgs>(args?: SelectSubset<T, EbookFindFirstOrThrowArgs<ExtArgs>>): Prisma__EbookClient<$Result.GetResult<Prisma.$EbookPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Ebooks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EbookFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ebooks
     * const ebooks = await prisma.ebook.findMany()
     * 
     * // Get first 10 Ebooks
     * const ebooks = await prisma.ebook.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ebookWithIdOnly = await prisma.ebook.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EbookFindManyArgs>(args?: SelectSubset<T, EbookFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EbookPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Ebook.
     * @param {EbookCreateArgs} args - Arguments to create a Ebook.
     * @example
     * // Create one Ebook
     * const Ebook = await prisma.ebook.create({
     *   data: {
     *     // ... data to create a Ebook
     *   }
     * })
     * 
     */
    create<T extends EbookCreateArgs>(args: SelectSubset<T, EbookCreateArgs<ExtArgs>>): Prisma__EbookClient<$Result.GetResult<Prisma.$EbookPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Ebooks.
     * @param {EbookCreateManyArgs} args - Arguments to create many Ebooks.
     * @example
     * // Create many Ebooks
     * const ebook = await prisma.ebook.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EbookCreateManyArgs>(args?: SelectSubset<T, EbookCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ebooks and returns the data saved in the database.
     * @param {EbookCreateManyAndReturnArgs} args - Arguments to create many Ebooks.
     * @example
     * // Create many Ebooks
     * const ebook = await prisma.ebook.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ebooks and only return the `id`
     * const ebookWithIdOnly = await prisma.ebook.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EbookCreateManyAndReturnArgs>(args?: SelectSubset<T, EbookCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EbookPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Ebook.
     * @param {EbookDeleteArgs} args - Arguments to delete one Ebook.
     * @example
     * // Delete one Ebook
     * const Ebook = await prisma.ebook.delete({
     *   where: {
     *     // ... filter to delete one Ebook
     *   }
     * })
     * 
     */
    delete<T extends EbookDeleteArgs>(args: SelectSubset<T, EbookDeleteArgs<ExtArgs>>): Prisma__EbookClient<$Result.GetResult<Prisma.$EbookPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Ebook.
     * @param {EbookUpdateArgs} args - Arguments to update one Ebook.
     * @example
     * // Update one Ebook
     * const ebook = await prisma.ebook.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EbookUpdateArgs>(args: SelectSubset<T, EbookUpdateArgs<ExtArgs>>): Prisma__EbookClient<$Result.GetResult<Prisma.$EbookPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Ebooks.
     * @param {EbookDeleteManyArgs} args - Arguments to filter Ebooks to delete.
     * @example
     * // Delete a few Ebooks
     * const { count } = await prisma.ebook.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EbookDeleteManyArgs>(args?: SelectSubset<T, EbookDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ebooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EbookUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ebooks
     * const ebook = await prisma.ebook.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EbookUpdateManyArgs>(args: SelectSubset<T, EbookUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Ebook.
     * @param {EbookUpsertArgs} args - Arguments to update or create a Ebook.
     * @example
     * // Update or create a Ebook
     * const ebook = await prisma.ebook.upsert({
     *   create: {
     *     // ... data to create a Ebook
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ebook we want to update
     *   }
     * })
     */
    upsert<T extends EbookUpsertArgs>(args: SelectSubset<T, EbookUpsertArgs<ExtArgs>>): Prisma__EbookClient<$Result.GetResult<Prisma.$EbookPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Ebooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EbookCountArgs} args - Arguments to filter Ebooks to count.
     * @example
     * // Count the number of Ebooks
     * const count = await prisma.ebook.count({
     *   where: {
     *     // ... the filter for the Ebooks we want to count
     *   }
     * })
    **/
    count<T extends EbookCountArgs>(
      args?: Subset<T, EbookCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EbookCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ebook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EbookAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EbookAggregateArgs>(args: Subset<T, EbookAggregateArgs>): Prisma.PrismaPromise<GetEbookAggregateType<T>>

    /**
     * Group by Ebook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EbookGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EbookGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EbookGroupByArgs['orderBy'] }
        : { orderBy?: EbookGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EbookGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEbookGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ebook model
   */
  readonly fields: EbookFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ebook.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EbookClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    readingLogs<T extends Ebook$readingLogsArgs<ExtArgs> = {}>(args?: Subset<T, Ebook$readingLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingLogPayload<ExtArgs>, T, "findMany"> | Null>
    readingProgress<T extends Ebook$readingProgressArgs<ExtArgs> = {}>(args?: Subset<T, Ebook$readingProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "findMany"> | Null>
    readlist<T extends Ebook$readlistArgs<ExtArgs> = {}>(args?: Subset<T, Ebook$readlistArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadlistPayload<ExtArgs>, T, "findMany"> | Null>
    annotations<T extends Ebook$annotationsArgs<ExtArgs> = {}>(args?: Subset<T, Ebook$annotationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnotationPayload<ExtArgs>, T, "findMany"> | Null>
    categoryRel<T extends Ebook$categoryRelArgs<ExtArgs> = {}>(args?: Subset<T, Ebook$categoryRelArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Ebook model
   */ 
  interface EbookFieldRefs {
    readonly id: FieldRef<"Ebook", 'String'>
    readonly title: FieldRef<"Ebook", 'String'>
    readonly author: FieldRef<"Ebook", 'String'>
    readonly description: FieldRef<"Ebook", 'String'>
    readonly coverUrl: FieldRef<"Ebook", 'String'>
    readonly pdfUrl: FieldRef<"Ebook", 'String'>
    readonly publicId: FieldRef<"Ebook", 'String'>
    readonly category: FieldRef<"Ebook", 'String'>
    readonly categoryId: FieldRef<"Ebook", 'Int'>
    readonly isPremium: FieldRef<"Ebook", 'Boolean'>
    readonly isActive: FieldRef<"Ebook", 'Boolean'>
    readonly priority: FieldRef<"Ebook", 'Int'>
    readonly createdAt: FieldRef<"Ebook", 'DateTime'>
    readonly updatedAt: FieldRef<"Ebook", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ebook findUnique
   */
  export type EbookFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ebook
     */
    select?: EbookSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EbookInclude<ExtArgs> | null
    /**
     * Filter, which Ebook to fetch.
     */
    where: EbookWhereUniqueInput
  }

  /**
   * Ebook findUniqueOrThrow
   */
  export type EbookFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ebook
     */
    select?: EbookSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EbookInclude<ExtArgs> | null
    /**
     * Filter, which Ebook to fetch.
     */
    where: EbookWhereUniqueInput
  }

  /**
   * Ebook findFirst
   */
  export type EbookFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ebook
     */
    select?: EbookSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EbookInclude<ExtArgs> | null
    /**
     * Filter, which Ebook to fetch.
     */
    where?: EbookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ebooks to fetch.
     */
    orderBy?: EbookOrderByWithRelationInput | EbookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ebooks.
     */
    cursor?: EbookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ebooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ebooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ebooks.
     */
    distinct?: EbookScalarFieldEnum | EbookScalarFieldEnum[]
  }

  /**
   * Ebook findFirstOrThrow
   */
  export type EbookFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ebook
     */
    select?: EbookSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EbookInclude<ExtArgs> | null
    /**
     * Filter, which Ebook to fetch.
     */
    where?: EbookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ebooks to fetch.
     */
    orderBy?: EbookOrderByWithRelationInput | EbookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ebooks.
     */
    cursor?: EbookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ebooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ebooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ebooks.
     */
    distinct?: EbookScalarFieldEnum | EbookScalarFieldEnum[]
  }

  /**
   * Ebook findMany
   */
  export type EbookFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ebook
     */
    select?: EbookSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EbookInclude<ExtArgs> | null
    /**
     * Filter, which Ebooks to fetch.
     */
    where?: EbookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ebooks to fetch.
     */
    orderBy?: EbookOrderByWithRelationInput | EbookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ebooks.
     */
    cursor?: EbookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ebooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ebooks.
     */
    skip?: number
    distinct?: EbookScalarFieldEnum | EbookScalarFieldEnum[]
  }

  /**
   * Ebook create
   */
  export type EbookCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ebook
     */
    select?: EbookSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EbookInclude<ExtArgs> | null
    /**
     * The data needed to create a Ebook.
     */
    data: XOR<EbookCreateInput, EbookUncheckedCreateInput>
  }

  /**
   * Ebook createMany
   */
  export type EbookCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ebooks.
     */
    data: EbookCreateManyInput | EbookCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Ebook createManyAndReturn
   */
  export type EbookCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ebook
     */
    select?: EbookSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Ebooks.
     */
    data: EbookCreateManyInput | EbookCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EbookIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ebook update
   */
  export type EbookUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ebook
     */
    select?: EbookSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EbookInclude<ExtArgs> | null
    /**
     * The data needed to update a Ebook.
     */
    data: XOR<EbookUpdateInput, EbookUncheckedUpdateInput>
    /**
     * Choose, which Ebook to update.
     */
    where: EbookWhereUniqueInput
  }

  /**
   * Ebook updateMany
   */
  export type EbookUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ebooks.
     */
    data: XOR<EbookUpdateManyMutationInput, EbookUncheckedUpdateManyInput>
    /**
     * Filter which Ebooks to update
     */
    where?: EbookWhereInput
  }

  /**
   * Ebook upsert
   */
  export type EbookUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ebook
     */
    select?: EbookSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EbookInclude<ExtArgs> | null
    /**
     * The filter to search for the Ebook to update in case it exists.
     */
    where: EbookWhereUniqueInput
    /**
     * In case the Ebook found by the `where` argument doesn't exist, create a new Ebook with this data.
     */
    create: XOR<EbookCreateInput, EbookUncheckedCreateInput>
    /**
     * In case the Ebook was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EbookUpdateInput, EbookUncheckedUpdateInput>
  }

  /**
   * Ebook delete
   */
  export type EbookDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ebook
     */
    select?: EbookSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EbookInclude<ExtArgs> | null
    /**
     * Filter which Ebook to delete.
     */
    where: EbookWhereUniqueInput
  }

  /**
   * Ebook deleteMany
   */
  export type EbookDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ebooks to delete
     */
    where?: EbookWhereInput
  }

  /**
   * Ebook.readingLogs
   */
  export type Ebook$readingLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingLog
     */
    select?: ReadingLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingLogInclude<ExtArgs> | null
    where?: ReadingLogWhereInput
    orderBy?: ReadingLogOrderByWithRelationInput | ReadingLogOrderByWithRelationInput[]
    cursor?: ReadingLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReadingLogScalarFieldEnum | ReadingLogScalarFieldEnum[]
  }

  /**
   * Ebook.readingProgress
   */
  export type Ebook$readingProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    where?: ReadingProgressWhereInput
    orderBy?: ReadingProgressOrderByWithRelationInput | ReadingProgressOrderByWithRelationInput[]
    cursor?: ReadingProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReadingProgressScalarFieldEnum | ReadingProgressScalarFieldEnum[]
  }

  /**
   * Ebook.readlist
   */
  export type Ebook$readlistArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Readlist
     */
    select?: ReadlistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadlistInclude<ExtArgs> | null
    where?: ReadlistWhereInput
    orderBy?: ReadlistOrderByWithRelationInput | ReadlistOrderByWithRelationInput[]
    cursor?: ReadlistWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReadlistScalarFieldEnum | ReadlistScalarFieldEnum[]
  }

  /**
   * Ebook.annotations
   */
  export type Ebook$annotationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Annotation
     */
    select?: AnnotationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnotationInclude<ExtArgs> | null
    where?: AnnotationWhereInput
    orderBy?: AnnotationOrderByWithRelationInput | AnnotationOrderByWithRelationInput[]
    cursor?: AnnotationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnnotationScalarFieldEnum | AnnotationScalarFieldEnum[]
  }

  /**
   * Ebook.categoryRel
   */
  export type Ebook$categoryRelArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    where?: CategoryWhereInput
  }

  /**
   * Ebook without action
   */
  export type EbookDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ebook
     */
    select?: EbookSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EbookInclude<ExtArgs> | null
  }


  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryAvgAggregateOutputType = {
    id: number | null
    displayOrder: number | null
  }

  export type CategorySumAggregateOutputType = {
    id: number | null
    displayOrder: number | null
  }

  export type CategoryMinAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    icon: string | null
    description: string | null
    displayOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    icon: string | null
    description: string | null
    displayOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    icon: number
    description: number
    displayOrder: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CategoryAvgAggregateInputType = {
    id?: true
    displayOrder?: true
  }

  export type CategorySumAggregateInputType = {
    id?: true
    displayOrder?: true
  }

  export type CategoryMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    icon?: true
    description?: true
    displayOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    icon?: true
    description?: true
    displayOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    icon?: true
    description?: true
    displayOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _avg?: CategoryAvgAggregateInputType
    _sum?: CategorySumAggregateInputType
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: number
    name: string
    slug: string
    icon: string | null
    description: string | null
    displayOrder: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    icon?: boolean
    description?: boolean
    displayOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ebooks?: boolean | Category$ebooksArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    icon?: boolean
    description?: boolean
    displayOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["category"]>

  export type CategorySelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    icon?: boolean
    description?: boolean
    displayOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ebooks?: boolean | Category$ebooksArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      ebooks: Prisma.$EbookPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      slug: string
      icon: string | null
      description: string | null
      displayOrder: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {CategoryCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ebooks<T extends Category$ebooksArgs<ExtArgs> = {}>(args?: Subset<T, Category$ebooksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EbookPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */ 
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'Int'>
    readonly name: FieldRef<"Category", 'String'>
    readonly slug: FieldRef<"Category", 'String'>
    readonly icon: FieldRef<"Category", 'String'>
    readonly description: FieldRef<"Category", 'String'>
    readonly displayOrder: FieldRef<"Category", 'Int'>
    readonly isActive: FieldRef<"Category", 'Boolean'>
    readonly createdAt: FieldRef<"Category", 'DateTime'>
    readonly updatedAt: FieldRef<"Category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category createManyAndReturn
   */
  export type CategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
  }

  /**
   * Category.ebooks
   */
  export type Category$ebooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ebook
     */
    select?: EbookSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EbookInclude<ExtArgs> | null
    where?: EbookWhereInput
    orderBy?: EbookOrderByWithRelationInput | EbookOrderByWithRelationInput[]
    cursor?: EbookWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EbookScalarFieldEnum | EbookScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model Banner
   */

  export type AggregateBanner = {
    _count: BannerCountAggregateOutputType | null
    _avg: BannerAvgAggregateOutputType | null
    _sum: BannerSumAggregateOutputType | null
    _min: BannerMinAggregateOutputType | null
    _max: BannerMaxAggregateOutputType | null
  }

  export type BannerAvgAggregateOutputType = {
    priority: number | null
  }

  export type BannerSumAggregateOutputType = {
    priority: number | null
  }

  export type BannerMinAggregateOutputType = {
    id: string | null
    title: string | null
    subtitle: string | null
    ctaLabel: string | null
    ctaLink: string | null
    imageUrl: string | null
    isActive: boolean | null
    priority: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BannerMaxAggregateOutputType = {
    id: string | null
    title: string | null
    subtitle: string | null
    ctaLabel: string | null
    ctaLink: string | null
    imageUrl: string | null
    isActive: boolean | null
    priority: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BannerCountAggregateOutputType = {
    id: number
    title: number
    subtitle: number
    ctaLabel: number
    ctaLink: number
    imageUrl: number
    isActive: number
    priority: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BannerAvgAggregateInputType = {
    priority?: true
  }

  export type BannerSumAggregateInputType = {
    priority?: true
  }

  export type BannerMinAggregateInputType = {
    id?: true
    title?: true
    subtitle?: true
    ctaLabel?: true
    ctaLink?: true
    imageUrl?: true
    isActive?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BannerMaxAggregateInputType = {
    id?: true
    title?: true
    subtitle?: true
    ctaLabel?: true
    ctaLink?: true
    imageUrl?: true
    isActive?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BannerCountAggregateInputType = {
    id?: true
    title?: true
    subtitle?: true
    ctaLabel?: true
    ctaLink?: true
    imageUrl?: true
    isActive?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BannerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Banner to aggregate.
     */
    where?: BannerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Banners to fetch.
     */
    orderBy?: BannerOrderByWithRelationInput | BannerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BannerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Banners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Banners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Banners
    **/
    _count?: true | BannerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BannerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BannerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BannerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BannerMaxAggregateInputType
  }

  export type GetBannerAggregateType<T extends BannerAggregateArgs> = {
        [P in keyof T & keyof AggregateBanner]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBanner[P]>
      : GetScalarType<T[P], AggregateBanner[P]>
  }




  export type BannerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BannerWhereInput
    orderBy?: BannerOrderByWithAggregationInput | BannerOrderByWithAggregationInput[]
    by: BannerScalarFieldEnum[] | BannerScalarFieldEnum
    having?: BannerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BannerCountAggregateInputType | true
    _avg?: BannerAvgAggregateInputType
    _sum?: BannerSumAggregateInputType
    _min?: BannerMinAggregateInputType
    _max?: BannerMaxAggregateInputType
  }

  export type BannerGroupByOutputType = {
    id: string
    title: string
    subtitle: string | null
    ctaLabel: string | null
    ctaLink: string | null
    imageUrl: string | null
    isActive: boolean
    priority: number
    createdAt: Date
    updatedAt: Date
    _count: BannerCountAggregateOutputType | null
    _avg: BannerAvgAggregateOutputType | null
    _sum: BannerSumAggregateOutputType | null
    _min: BannerMinAggregateOutputType | null
    _max: BannerMaxAggregateOutputType | null
  }

  type GetBannerGroupByPayload<T extends BannerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BannerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BannerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BannerGroupByOutputType[P]>
            : GetScalarType<T[P], BannerGroupByOutputType[P]>
        }
      >
    >


  export type BannerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    subtitle?: boolean
    ctaLabel?: boolean
    ctaLink?: boolean
    imageUrl?: boolean
    isActive?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["banner"]>

  export type BannerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    subtitle?: boolean
    ctaLabel?: boolean
    ctaLink?: boolean
    imageUrl?: boolean
    isActive?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["banner"]>

  export type BannerSelectScalar = {
    id?: boolean
    title?: boolean
    subtitle?: boolean
    ctaLabel?: boolean
    ctaLink?: boolean
    imageUrl?: boolean
    isActive?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $BannerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Banner"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      subtitle: string | null
      ctaLabel: string | null
      ctaLink: string | null
      imageUrl: string | null
      isActive: boolean
      priority: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["banner"]>
    composites: {}
  }

  type BannerGetPayload<S extends boolean | null | undefined | BannerDefaultArgs> = $Result.GetResult<Prisma.$BannerPayload, S>

  type BannerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BannerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BannerCountAggregateInputType | true
    }

  export interface BannerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Banner'], meta: { name: 'Banner' } }
    /**
     * Find zero or one Banner that matches the filter.
     * @param {BannerFindUniqueArgs} args - Arguments to find a Banner
     * @example
     * // Get one Banner
     * const banner = await prisma.banner.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BannerFindUniqueArgs>(args: SelectSubset<T, BannerFindUniqueArgs<ExtArgs>>): Prisma__BannerClient<$Result.GetResult<Prisma.$BannerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Banner that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BannerFindUniqueOrThrowArgs} args - Arguments to find a Banner
     * @example
     * // Get one Banner
     * const banner = await prisma.banner.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BannerFindUniqueOrThrowArgs>(args: SelectSubset<T, BannerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BannerClient<$Result.GetResult<Prisma.$BannerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Banner that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BannerFindFirstArgs} args - Arguments to find a Banner
     * @example
     * // Get one Banner
     * const banner = await prisma.banner.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BannerFindFirstArgs>(args?: SelectSubset<T, BannerFindFirstArgs<ExtArgs>>): Prisma__BannerClient<$Result.GetResult<Prisma.$BannerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Banner that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BannerFindFirstOrThrowArgs} args - Arguments to find a Banner
     * @example
     * // Get one Banner
     * const banner = await prisma.banner.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BannerFindFirstOrThrowArgs>(args?: SelectSubset<T, BannerFindFirstOrThrowArgs<ExtArgs>>): Prisma__BannerClient<$Result.GetResult<Prisma.$BannerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Banners that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BannerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Banners
     * const banners = await prisma.banner.findMany()
     * 
     * // Get first 10 Banners
     * const banners = await prisma.banner.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bannerWithIdOnly = await prisma.banner.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BannerFindManyArgs>(args?: SelectSubset<T, BannerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BannerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Banner.
     * @param {BannerCreateArgs} args - Arguments to create a Banner.
     * @example
     * // Create one Banner
     * const Banner = await prisma.banner.create({
     *   data: {
     *     // ... data to create a Banner
     *   }
     * })
     * 
     */
    create<T extends BannerCreateArgs>(args: SelectSubset<T, BannerCreateArgs<ExtArgs>>): Prisma__BannerClient<$Result.GetResult<Prisma.$BannerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Banners.
     * @param {BannerCreateManyArgs} args - Arguments to create many Banners.
     * @example
     * // Create many Banners
     * const banner = await prisma.banner.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BannerCreateManyArgs>(args?: SelectSubset<T, BannerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Banners and returns the data saved in the database.
     * @param {BannerCreateManyAndReturnArgs} args - Arguments to create many Banners.
     * @example
     * // Create many Banners
     * const banner = await prisma.banner.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Banners and only return the `id`
     * const bannerWithIdOnly = await prisma.banner.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BannerCreateManyAndReturnArgs>(args?: SelectSubset<T, BannerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BannerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Banner.
     * @param {BannerDeleteArgs} args - Arguments to delete one Banner.
     * @example
     * // Delete one Banner
     * const Banner = await prisma.banner.delete({
     *   where: {
     *     // ... filter to delete one Banner
     *   }
     * })
     * 
     */
    delete<T extends BannerDeleteArgs>(args: SelectSubset<T, BannerDeleteArgs<ExtArgs>>): Prisma__BannerClient<$Result.GetResult<Prisma.$BannerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Banner.
     * @param {BannerUpdateArgs} args - Arguments to update one Banner.
     * @example
     * // Update one Banner
     * const banner = await prisma.banner.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BannerUpdateArgs>(args: SelectSubset<T, BannerUpdateArgs<ExtArgs>>): Prisma__BannerClient<$Result.GetResult<Prisma.$BannerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Banners.
     * @param {BannerDeleteManyArgs} args - Arguments to filter Banners to delete.
     * @example
     * // Delete a few Banners
     * const { count } = await prisma.banner.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BannerDeleteManyArgs>(args?: SelectSubset<T, BannerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Banners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BannerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Banners
     * const banner = await prisma.banner.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BannerUpdateManyArgs>(args: SelectSubset<T, BannerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Banner.
     * @param {BannerUpsertArgs} args - Arguments to update or create a Banner.
     * @example
     * // Update or create a Banner
     * const banner = await prisma.banner.upsert({
     *   create: {
     *     // ... data to create a Banner
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Banner we want to update
     *   }
     * })
     */
    upsert<T extends BannerUpsertArgs>(args: SelectSubset<T, BannerUpsertArgs<ExtArgs>>): Prisma__BannerClient<$Result.GetResult<Prisma.$BannerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Banners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BannerCountArgs} args - Arguments to filter Banners to count.
     * @example
     * // Count the number of Banners
     * const count = await prisma.banner.count({
     *   where: {
     *     // ... the filter for the Banners we want to count
     *   }
     * })
    **/
    count<T extends BannerCountArgs>(
      args?: Subset<T, BannerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BannerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Banner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BannerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BannerAggregateArgs>(args: Subset<T, BannerAggregateArgs>): Prisma.PrismaPromise<GetBannerAggregateType<T>>

    /**
     * Group by Banner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BannerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BannerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BannerGroupByArgs['orderBy'] }
        : { orderBy?: BannerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BannerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBannerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Banner model
   */
  readonly fields: BannerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Banner.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BannerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Banner model
   */ 
  interface BannerFieldRefs {
    readonly id: FieldRef<"Banner", 'String'>
    readonly title: FieldRef<"Banner", 'String'>
    readonly subtitle: FieldRef<"Banner", 'String'>
    readonly ctaLabel: FieldRef<"Banner", 'String'>
    readonly ctaLink: FieldRef<"Banner", 'String'>
    readonly imageUrl: FieldRef<"Banner", 'String'>
    readonly isActive: FieldRef<"Banner", 'Boolean'>
    readonly priority: FieldRef<"Banner", 'Int'>
    readonly createdAt: FieldRef<"Banner", 'DateTime'>
    readonly updatedAt: FieldRef<"Banner", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Banner findUnique
   */
  export type BannerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Banner
     */
    select?: BannerSelect<ExtArgs> | null
    /**
     * Filter, which Banner to fetch.
     */
    where: BannerWhereUniqueInput
  }

  /**
   * Banner findUniqueOrThrow
   */
  export type BannerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Banner
     */
    select?: BannerSelect<ExtArgs> | null
    /**
     * Filter, which Banner to fetch.
     */
    where: BannerWhereUniqueInput
  }

  /**
   * Banner findFirst
   */
  export type BannerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Banner
     */
    select?: BannerSelect<ExtArgs> | null
    /**
     * Filter, which Banner to fetch.
     */
    where?: BannerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Banners to fetch.
     */
    orderBy?: BannerOrderByWithRelationInput | BannerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Banners.
     */
    cursor?: BannerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Banners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Banners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Banners.
     */
    distinct?: BannerScalarFieldEnum | BannerScalarFieldEnum[]
  }

  /**
   * Banner findFirstOrThrow
   */
  export type BannerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Banner
     */
    select?: BannerSelect<ExtArgs> | null
    /**
     * Filter, which Banner to fetch.
     */
    where?: BannerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Banners to fetch.
     */
    orderBy?: BannerOrderByWithRelationInput | BannerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Banners.
     */
    cursor?: BannerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Banners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Banners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Banners.
     */
    distinct?: BannerScalarFieldEnum | BannerScalarFieldEnum[]
  }

  /**
   * Banner findMany
   */
  export type BannerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Banner
     */
    select?: BannerSelect<ExtArgs> | null
    /**
     * Filter, which Banners to fetch.
     */
    where?: BannerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Banners to fetch.
     */
    orderBy?: BannerOrderByWithRelationInput | BannerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Banners.
     */
    cursor?: BannerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Banners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Banners.
     */
    skip?: number
    distinct?: BannerScalarFieldEnum | BannerScalarFieldEnum[]
  }

  /**
   * Banner create
   */
  export type BannerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Banner
     */
    select?: BannerSelect<ExtArgs> | null
    /**
     * The data needed to create a Banner.
     */
    data: XOR<BannerCreateInput, BannerUncheckedCreateInput>
  }

  /**
   * Banner createMany
   */
  export type BannerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Banners.
     */
    data: BannerCreateManyInput | BannerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Banner createManyAndReturn
   */
  export type BannerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Banner
     */
    select?: BannerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Banners.
     */
    data: BannerCreateManyInput | BannerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Banner update
   */
  export type BannerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Banner
     */
    select?: BannerSelect<ExtArgs> | null
    /**
     * The data needed to update a Banner.
     */
    data: XOR<BannerUpdateInput, BannerUncheckedUpdateInput>
    /**
     * Choose, which Banner to update.
     */
    where: BannerWhereUniqueInput
  }

  /**
   * Banner updateMany
   */
  export type BannerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Banners.
     */
    data: XOR<BannerUpdateManyMutationInput, BannerUncheckedUpdateManyInput>
    /**
     * Filter which Banners to update
     */
    where?: BannerWhereInput
  }

  /**
   * Banner upsert
   */
  export type BannerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Banner
     */
    select?: BannerSelect<ExtArgs> | null
    /**
     * The filter to search for the Banner to update in case it exists.
     */
    where: BannerWhereUniqueInput
    /**
     * In case the Banner found by the `where` argument doesn't exist, create a new Banner with this data.
     */
    create: XOR<BannerCreateInput, BannerUncheckedCreateInput>
    /**
     * In case the Banner was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BannerUpdateInput, BannerUncheckedUpdateInput>
  }

  /**
   * Banner delete
   */
  export type BannerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Banner
     */
    select?: BannerSelect<ExtArgs> | null
    /**
     * Filter which Banner to delete.
     */
    where: BannerWhereUniqueInput
  }

  /**
   * Banner deleteMany
   */
  export type BannerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Banners to delete
     */
    where?: BannerWhereInput
  }

  /**
   * Banner without action
   */
  export type BannerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Banner
     */
    select?: BannerSelect<ExtArgs> | null
  }


  /**
   * Model ReadingLog
   */

  export type AggregateReadingLog = {
    _count: ReadingLogCountAggregateOutputType | null
    _min: ReadingLogMinAggregateOutputType | null
    _max: ReadingLogMaxAggregateOutputType | null
  }

  export type ReadingLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    ebookId: string | null
    startedAt: Date | null
    lastReadAt: Date | null
  }

  export type ReadingLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    ebookId: string | null
    startedAt: Date | null
    lastReadAt: Date | null
  }

  export type ReadingLogCountAggregateOutputType = {
    id: number
    userId: number
    ebookId: number
    startedAt: number
    lastReadAt: number
    _all: number
  }


  export type ReadingLogMinAggregateInputType = {
    id?: true
    userId?: true
    ebookId?: true
    startedAt?: true
    lastReadAt?: true
  }

  export type ReadingLogMaxAggregateInputType = {
    id?: true
    userId?: true
    ebookId?: true
    startedAt?: true
    lastReadAt?: true
  }

  export type ReadingLogCountAggregateInputType = {
    id?: true
    userId?: true
    ebookId?: true
    startedAt?: true
    lastReadAt?: true
    _all?: true
  }

  export type ReadingLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReadingLog to aggregate.
     */
    where?: ReadingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingLogs to fetch.
     */
    orderBy?: ReadingLogOrderByWithRelationInput | ReadingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReadingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReadingLogs
    **/
    _count?: true | ReadingLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReadingLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReadingLogMaxAggregateInputType
  }

  export type GetReadingLogAggregateType<T extends ReadingLogAggregateArgs> = {
        [P in keyof T & keyof AggregateReadingLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReadingLog[P]>
      : GetScalarType<T[P], AggregateReadingLog[P]>
  }




  export type ReadingLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadingLogWhereInput
    orderBy?: ReadingLogOrderByWithAggregationInput | ReadingLogOrderByWithAggregationInput[]
    by: ReadingLogScalarFieldEnum[] | ReadingLogScalarFieldEnum
    having?: ReadingLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReadingLogCountAggregateInputType | true
    _min?: ReadingLogMinAggregateInputType
    _max?: ReadingLogMaxAggregateInputType
  }

  export type ReadingLogGroupByOutputType = {
    id: string
    userId: string
    ebookId: string
    startedAt: Date
    lastReadAt: Date
    _count: ReadingLogCountAggregateOutputType | null
    _min: ReadingLogMinAggregateOutputType | null
    _max: ReadingLogMaxAggregateOutputType | null
  }

  type GetReadingLogGroupByPayload<T extends ReadingLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReadingLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReadingLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReadingLogGroupByOutputType[P]>
            : GetScalarType<T[P], ReadingLogGroupByOutputType[P]>
        }
      >
    >


  export type ReadingLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ebookId?: boolean
    startedAt?: boolean
    lastReadAt?: boolean
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["readingLog"]>

  export type ReadingLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ebookId?: boolean
    startedAt?: boolean
    lastReadAt?: boolean
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["readingLog"]>

  export type ReadingLogSelectScalar = {
    id?: boolean
    userId?: boolean
    ebookId?: boolean
    startedAt?: boolean
    lastReadAt?: boolean
  }

  export type ReadingLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ReadingLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ReadingLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReadingLog"
    objects: {
      ebook: Prisma.$EbookPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      ebookId: string
      startedAt: Date
      lastReadAt: Date
    }, ExtArgs["result"]["readingLog"]>
    composites: {}
  }

  type ReadingLogGetPayload<S extends boolean | null | undefined | ReadingLogDefaultArgs> = $Result.GetResult<Prisma.$ReadingLogPayload, S>

  type ReadingLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReadingLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReadingLogCountAggregateInputType | true
    }

  export interface ReadingLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReadingLog'], meta: { name: 'ReadingLog' } }
    /**
     * Find zero or one ReadingLog that matches the filter.
     * @param {ReadingLogFindUniqueArgs} args - Arguments to find a ReadingLog
     * @example
     * // Get one ReadingLog
     * const readingLog = await prisma.readingLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReadingLogFindUniqueArgs>(args: SelectSubset<T, ReadingLogFindUniqueArgs<ExtArgs>>): Prisma__ReadingLogClient<$Result.GetResult<Prisma.$ReadingLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ReadingLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReadingLogFindUniqueOrThrowArgs} args - Arguments to find a ReadingLog
     * @example
     * // Get one ReadingLog
     * const readingLog = await prisma.readingLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReadingLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ReadingLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReadingLogClient<$Result.GetResult<Prisma.$ReadingLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ReadingLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingLogFindFirstArgs} args - Arguments to find a ReadingLog
     * @example
     * // Get one ReadingLog
     * const readingLog = await prisma.readingLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReadingLogFindFirstArgs>(args?: SelectSubset<T, ReadingLogFindFirstArgs<ExtArgs>>): Prisma__ReadingLogClient<$Result.GetResult<Prisma.$ReadingLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ReadingLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingLogFindFirstOrThrowArgs} args - Arguments to find a ReadingLog
     * @example
     * // Get one ReadingLog
     * const readingLog = await prisma.readingLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReadingLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ReadingLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReadingLogClient<$Result.GetResult<Prisma.$ReadingLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ReadingLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReadingLogs
     * const readingLogs = await prisma.readingLog.findMany()
     * 
     * // Get first 10 ReadingLogs
     * const readingLogs = await prisma.readingLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const readingLogWithIdOnly = await prisma.readingLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReadingLogFindManyArgs>(args?: SelectSubset<T, ReadingLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ReadingLog.
     * @param {ReadingLogCreateArgs} args - Arguments to create a ReadingLog.
     * @example
     * // Create one ReadingLog
     * const ReadingLog = await prisma.readingLog.create({
     *   data: {
     *     // ... data to create a ReadingLog
     *   }
     * })
     * 
     */
    create<T extends ReadingLogCreateArgs>(args: SelectSubset<T, ReadingLogCreateArgs<ExtArgs>>): Prisma__ReadingLogClient<$Result.GetResult<Prisma.$ReadingLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ReadingLogs.
     * @param {ReadingLogCreateManyArgs} args - Arguments to create many ReadingLogs.
     * @example
     * // Create many ReadingLogs
     * const readingLog = await prisma.readingLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReadingLogCreateManyArgs>(args?: SelectSubset<T, ReadingLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReadingLogs and returns the data saved in the database.
     * @param {ReadingLogCreateManyAndReturnArgs} args - Arguments to create many ReadingLogs.
     * @example
     * // Create many ReadingLogs
     * const readingLog = await prisma.readingLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReadingLogs and only return the `id`
     * const readingLogWithIdOnly = await prisma.readingLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReadingLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ReadingLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ReadingLog.
     * @param {ReadingLogDeleteArgs} args - Arguments to delete one ReadingLog.
     * @example
     * // Delete one ReadingLog
     * const ReadingLog = await prisma.readingLog.delete({
     *   where: {
     *     // ... filter to delete one ReadingLog
     *   }
     * })
     * 
     */
    delete<T extends ReadingLogDeleteArgs>(args: SelectSubset<T, ReadingLogDeleteArgs<ExtArgs>>): Prisma__ReadingLogClient<$Result.GetResult<Prisma.$ReadingLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ReadingLog.
     * @param {ReadingLogUpdateArgs} args - Arguments to update one ReadingLog.
     * @example
     * // Update one ReadingLog
     * const readingLog = await prisma.readingLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReadingLogUpdateArgs>(args: SelectSubset<T, ReadingLogUpdateArgs<ExtArgs>>): Prisma__ReadingLogClient<$Result.GetResult<Prisma.$ReadingLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ReadingLogs.
     * @param {ReadingLogDeleteManyArgs} args - Arguments to filter ReadingLogs to delete.
     * @example
     * // Delete a few ReadingLogs
     * const { count } = await prisma.readingLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReadingLogDeleteManyArgs>(args?: SelectSubset<T, ReadingLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReadingLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReadingLogs
     * const readingLog = await prisma.readingLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReadingLogUpdateManyArgs>(args: SelectSubset<T, ReadingLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ReadingLog.
     * @param {ReadingLogUpsertArgs} args - Arguments to update or create a ReadingLog.
     * @example
     * // Update or create a ReadingLog
     * const readingLog = await prisma.readingLog.upsert({
     *   create: {
     *     // ... data to create a ReadingLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReadingLog we want to update
     *   }
     * })
     */
    upsert<T extends ReadingLogUpsertArgs>(args: SelectSubset<T, ReadingLogUpsertArgs<ExtArgs>>): Prisma__ReadingLogClient<$Result.GetResult<Prisma.$ReadingLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ReadingLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingLogCountArgs} args - Arguments to filter ReadingLogs to count.
     * @example
     * // Count the number of ReadingLogs
     * const count = await prisma.readingLog.count({
     *   where: {
     *     // ... the filter for the ReadingLogs we want to count
     *   }
     * })
    **/
    count<T extends ReadingLogCountArgs>(
      args?: Subset<T, ReadingLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReadingLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReadingLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReadingLogAggregateArgs>(args: Subset<T, ReadingLogAggregateArgs>): Prisma.PrismaPromise<GetReadingLogAggregateType<T>>

    /**
     * Group by ReadingLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReadingLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReadingLogGroupByArgs['orderBy'] }
        : { orderBy?: ReadingLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReadingLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReadingLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReadingLog model
   */
  readonly fields: ReadingLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReadingLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReadingLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ebook<T extends EbookDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EbookDefaultArgs<ExtArgs>>): Prisma__EbookClient<$Result.GetResult<Prisma.$EbookPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReadingLog model
   */ 
  interface ReadingLogFieldRefs {
    readonly id: FieldRef<"ReadingLog", 'String'>
    readonly userId: FieldRef<"ReadingLog", 'String'>
    readonly ebookId: FieldRef<"ReadingLog", 'String'>
    readonly startedAt: FieldRef<"ReadingLog", 'DateTime'>
    readonly lastReadAt: FieldRef<"ReadingLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReadingLog findUnique
   */
  export type ReadingLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingLog
     */
    select?: ReadingLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingLogInclude<ExtArgs> | null
    /**
     * Filter, which ReadingLog to fetch.
     */
    where: ReadingLogWhereUniqueInput
  }

  /**
   * ReadingLog findUniqueOrThrow
   */
  export type ReadingLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingLog
     */
    select?: ReadingLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingLogInclude<ExtArgs> | null
    /**
     * Filter, which ReadingLog to fetch.
     */
    where: ReadingLogWhereUniqueInput
  }

  /**
   * ReadingLog findFirst
   */
  export type ReadingLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingLog
     */
    select?: ReadingLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingLogInclude<ExtArgs> | null
    /**
     * Filter, which ReadingLog to fetch.
     */
    where?: ReadingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingLogs to fetch.
     */
    orderBy?: ReadingLogOrderByWithRelationInput | ReadingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReadingLogs.
     */
    cursor?: ReadingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReadingLogs.
     */
    distinct?: ReadingLogScalarFieldEnum | ReadingLogScalarFieldEnum[]
  }

  /**
   * ReadingLog findFirstOrThrow
   */
  export type ReadingLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingLog
     */
    select?: ReadingLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingLogInclude<ExtArgs> | null
    /**
     * Filter, which ReadingLog to fetch.
     */
    where?: ReadingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingLogs to fetch.
     */
    orderBy?: ReadingLogOrderByWithRelationInput | ReadingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReadingLogs.
     */
    cursor?: ReadingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReadingLogs.
     */
    distinct?: ReadingLogScalarFieldEnum | ReadingLogScalarFieldEnum[]
  }

  /**
   * ReadingLog findMany
   */
  export type ReadingLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingLog
     */
    select?: ReadingLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingLogInclude<ExtArgs> | null
    /**
     * Filter, which ReadingLogs to fetch.
     */
    where?: ReadingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingLogs to fetch.
     */
    orderBy?: ReadingLogOrderByWithRelationInput | ReadingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReadingLogs.
     */
    cursor?: ReadingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingLogs.
     */
    skip?: number
    distinct?: ReadingLogScalarFieldEnum | ReadingLogScalarFieldEnum[]
  }

  /**
   * ReadingLog create
   */
  export type ReadingLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingLog
     */
    select?: ReadingLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingLogInclude<ExtArgs> | null
    /**
     * The data needed to create a ReadingLog.
     */
    data: XOR<ReadingLogCreateInput, ReadingLogUncheckedCreateInput>
  }

  /**
   * ReadingLog createMany
   */
  export type ReadingLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReadingLogs.
     */
    data: ReadingLogCreateManyInput | ReadingLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReadingLog createManyAndReturn
   */
  export type ReadingLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingLog
     */
    select?: ReadingLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ReadingLogs.
     */
    data: ReadingLogCreateManyInput | ReadingLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReadingLog update
   */
  export type ReadingLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingLog
     */
    select?: ReadingLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingLogInclude<ExtArgs> | null
    /**
     * The data needed to update a ReadingLog.
     */
    data: XOR<ReadingLogUpdateInput, ReadingLogUncheckedUpdateInput>
    /**
     * Choose, which ReadingLog to update.
     */
    where: ReadingLogWhereUniqueInput
  }

  /**
   * ReadingLog updateMany
   */
  export type ReadingLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReadingLogs.
     */
    data: XOR<ReadingLogUpdateManyMutationInput, ReadingLogUncheckedUpdateManyInput>
    /**
     * Filter which ReadingLogs to update
     */
    where?: ReadingLogWhereInput
  }

  /**
   * ReadingLog upsert
   */
  export type ReadingLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingLog
     */
    select?: ReadingLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingLogInclude<ExtArgs> | null
    /**
     * The filter to search for the ReadingLog to update in case it exists.
     */
    where: ReadingLogWhereUniqueInput
    /**
     * In case the ReadingLog found by the `where` argument doesn't exist, create a new ReadingLog with this data.
     */
    create: XOR<ReadingLogCreateInput, ReadingLogUncheckedCreateInput>
    /**
     * In case the ReadingLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReadingLogUpdateInput, ReadingLogUncheckedUpdateInput>
  }

  /**
   * ReadingLog delete
   */
  export type ReadingLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingLog
     */
    select?: ReadingLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingLogInclude<ExtArgs> | null
    /**
     * Filter which ReadingLog to delete.
     */
    where: ReadingLogWhereUniqueInput
  }

  /**
   * ReadingLog deleteMany
   */
  export type ReadingLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReadingLogs to delete
     */
    where?: ReadingLogWhereInput
  }

  /**
   * ReadingLog without action
   */
  export type ReadingLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingLog
     */
    select?: ReadingLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingLogInclude<ExtArgs> | null
  }


  /**
   * Model AdminEvent
   */

  export type AggregateAdminEvent = {
    _count: AdminEventCountAggregateOutputType | null
    _min: AdminEventMinAggregateOutputType | null
    _max: AdminEventMaxAggregateOutputType | null
  }

  export type AdminEventMinAggregateOutputType = {
    id: string | null
    type: string | null
    title: string | null
    description: string | null
    createdAt: Date | null
  }

  export type AdminEventMaxAggregateOutputType = {
    id: string | null
    type: string | null
    title: string | null
    description: string | null
    createdAt: Date | null
  }

  export type AdminEventCountAggregateOutputType = {
    id: number
    type: number
    title: number
    description: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type AdminEventMinAggregateInputType = {
    id?: true
    type?: true
    title?: true
    description?: true
    createdAt?: true
  }

  export type AdminEventMaxAggregateInputType = {
    id?: true
    type?: true
    title?: true
    description?: true
    createdAt?: true
  }

  export type AdminEventCountAggregateInputType = {
    id?: true
    type?: true
    title?: true
    description?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type AdminEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminEvent to aggregate.
     */
    where?: AdminEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminEvents to fetch.
     */
    orderBy?: AdminEventOrderByWithRelationInput | AdminEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminEvents
    **/
    _count?: true | AdminEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminEventMaxAggregateInputType
  }

  export type GetAdminEventAggregateType<T extends AdminEventAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminEvent[P]>
      : GetScalarType<T[P], AggregateAdminEvent[P]>
  }




  export type AdminEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminEventWhereInput
    orderBy?: AdminEventOrderByWithAggregationInput | AdminEventOrderByWithAggregationInput[]
    by: AdminEventScalarFieldEnum[] | AdminEventScalarFieldEnum
    having?: AdminEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminEventCountAggregateInputType | true
    _min?: AdminEventMinAggregateInputType
    _max?: AdminEventMaxAggregateInputType
  }

  export type AdminEventGroupByOutputType = {
    id: string
    type: string
    title: string
    description: string | null
    metadata: JsonValue | null
    createdAt: Date
    _count: AdminEventCountAggregateOutputType | null
    _min: AdminEventMinAggregateOutputType | null
    _max: AdminEventMaxAggregateOutputType | null
  }

  type GetAdminEventGroupByPayload<T extends AdminEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminEventGroupByOutputType[P]>
            : GetScalarType<T[P], AdminEventGroupByOutputType[P]>
        }
      >
    >


  export type AdminEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["adminEvent"]>

  export type AdminEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["adminEvent"]>

  export type AdminEventSelectScalar = {
    id?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    metadata?: boolean
    createdAt?: boolean
  }


  export type $AdminEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AdminEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      title: string
      description: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["adminEvent"]>
    composites: {}
  }

  type AdminEventGetPayload<S extends boolean | null | undefined | AdminEventDefaultArgs> = $Result.GetResult<Prisma.$AdminEventPayload, S>

  type AdminEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AdminEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AdminEventCountAggregateInputType | true
    }

  export interface AdminEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminEvent'], meta: { name: 'AdminEvent' } }
    /**
     * Find zero or one AdminEvent that matches the filter.
     * @param {AdminEventFindUniqueArgs} args - Arguments to find a AdminEvent
     * @example
     * // Get one AdminEvent
     * const adminEvent = await prisma.adminEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminEventFindUniqueArgs>(args: SelectSubset<T, AdminEventFindUniqueArgs<ExtArgs>>): Prisma__AdminEventClient<$Result.GetResult<Prisma.$AdminEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AdminEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AdminEventFindUniqueOrThrowArgs} args - Arguments to find a AdminEvent
     * @example
     * // Get one AdminEvent
     * const adminEvent = await prisma.adminEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminEventFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminEventClient<$Result.GetResult<Prisma.$AdminEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AdminEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminEventFindFirstArgs} args - Arguments to find a AdminEvent
     * @example
     * // Get one AdminEvent
     * const adminEvent = await prisma.adminEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminEventFindFirstArgs>(args?: SelectSubset<T, AdminEventFindFirstArgs<ExtArgs>>): Prisma__AdminEventClient<$Result.GetResult<Prisma.$AdminEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AdminEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminEventFindFirstOrThrowArgs} args - Arguments to find a AdminEvent
     * @example
     * // Get one AdminEvent
     * const adminEvent = await prisma.adminEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminEventFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminEventClient<$Result.GetResult<Prisma.$AdminEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AdminEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminEvents
     * const adminEvents = await prisma.adminEvent.findMany()
     * 
     * // Get first 10 AdminEvents
     * const adminEvents = await prisma.adminEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminEventWithIdOnly = await prisma.adminEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminEventFindManyArgs>(args?: SelectSubset<T, AdminEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AdminEvent.
     * @param {AdminEventCreateArgs} args - Arguments to create a AdminEvent.
     * @example
     * // Create one AdminEvent
     * const AdminEvent = await prisma.adminEvent.create({
     *   data: {
     *     // ... data to create a AdminEvent
     *   }
     * })
     * 
     */
    create<T extends AdminEventCreateArgs>(args: SelectSubset<T, AdminEventCreateArgs<ExtArgs>>): Prisma__AdminEventClient<$Result.GetResult<Prisma.$AdminEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AdminEvents.
     * @param {AdminEventCreateManyArgs} args - Arguments to create many AdminEvents.
     * @example
     * // Create many AdminEvents
     * const adminEvent = await prisma.adminEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminEventCreateManyArgs>(args?: SelectSubset<T, AdminEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AdminEvents and returns the data saved in the database.
     * @param {AdminEventCreateManyAndReturnArgs} args - Arguments to create many AdminEvents.
     * @example
     * // Create many AdminEvents
     * const adminEvent = await prisma.adminEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AdminEvents and only return the `id`
     * const adminEventWithIdOnly = await prisma.adminEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminEventCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AdminEvent.
     * @param {AdminEventDeleteArgs} args - Arguments to delete one AdminEvent.
     * @example
     * // Delete one AdminEvent
     * const AdminEvent = await prisma.adminEvent.delete({
     *   where: {
     *     // ... filter to delete one AdminEvent
     *   }
     * })
     * 
     */
    delete<T extends AdminEventDeleteArgs>(args: SelectSubset<T, AdminEventDeleteArgs<ExtArgs>>): Prisma__AdminEventClient<$Result.GetResult<Prisma.$AdminEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AdminEvent.
     * @param {AdminEventUpdateArgs} args - Arguments to update one AdminEvent.
     * @example
     * // Update one AdminEvent
     * const adminEvent = await prisma.adminEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminEventUpdateArgs>(args: SelectSubset<T, AdminEventUpdateArgs<ExtArgs>>): Prisma__AdminEventClient<$Result.GetResult<Prisma.$AdminEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AdminEvents.
     * @param {AdminEventDeleteManyArgs} args - Arguments to filter AdminEvents to delete.
     * @example
     * // Delete a few AdminEvents
     * const { count } = await prisma.adminEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminEventDeleteManyArgs>(args?: SelectSubset<T, AdminEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminEvents
     * const adminEvent = await prisma.adminEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminEventUpdateManyArgs>(args: SelectSubset<T, AdminEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AdminEvent.
     * @param {AdminEventUpsertArgs} args - Arguments to update or create a AdminEvent.
     * @example
     * // Update or create a AdminEvent
     * const adminEvent = await prisma.adminEvent.upsert({
     *   create: {
     *     // ... data to create a AdminEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminEvent we want to update
     *   }
     * })
     */
    upsert<T extends AdminEventUpsertArgs>(args: SelectSubset<T, AdminEventUpsertArgs<ExtArgs>>): Prisma__AdminEventClient<$Result.GetResult<Prisma.$AdminEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AdminEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminEventCountArgs} args - Arguments to filter AdminEvents to count.
     * @example
     * // Count the number of AdminEvents
     * const count = await prisma.adminEvent.count({
     *   where: {
     *     // ... the filter for the AdminEvents we want to count
     *   }
     * })
    **/
    count<T extends AdminEventCountArgs>(
      args?: Subset<T, AdminEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminEventAggregateArgs>(args: Subset<T, AdminEventAggregateArgs>): Prisma.PrismaPromise<GetAdminEventAggregateType<T>>

    /**
     * Group by AdminEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminEventGroupByArgs['orderBy'] }
        : { orderBy?: AdminEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AdminEvent model
   */
  readonly fields: AdminEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AdminEvent model
   */ 
  interface AdminEventFieldRefs {
    readonly id: FieldRef<"AdminEvent", 'String'>
    readonly type: FieldRef<"AdminEvent", 'String'>
    readonly title: FieldRef<"AdminEvent", 'String'>
    readonly description: FieldRef<"AdminEvent", 'String'>
    readonly metadata: FieldRef<"AdminEvent", 'Json'>
    readonly createdAt: FieldRef<"AdminEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AdminEvent findUnique
   */
  export type AdminEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminEvent
     */
    select?: AdminEventSelect<ExtArgs> | null
    /**
     * Filter, which AdminEvent to fetch.
     */
    where: AdminEventWhereUniqueInput
  }

  /**
   * AdminEvent findUniqueOrThrow
   */
  export type AdminEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminEvent
     */
    select?: AdminEventSelect<ExtArgs> | null
    /**
     * Filter, which AdminEvent to fetch.
     */
    where: AdminEventWhereUniqueInput
  }

  /**
   * AdminEvent findFirst
   */
  export type AdminEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminEvent
     */
    select?: AdminEventSelect<ExtArgs> | null
    /**
     * Filter, which AdminEvent to fetch.
     */
    where?: AdminEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminEvents to fetch.
     */
    orderBy?: AdminEventOrderByWithRelationInput | AdminEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminEvents.
     */
    cursor?: AdminEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminEvents.
     */
    distinct?: AdminEventScalarFieldEnum | AdminEventScalarFieldEnum[]
  }

  /**
   * AdminEvent findFirstOrThrow
   */
  export type AdminEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminEvent
     */
    select?: AdminEventSelect<ExtArgs> | null
    /**
     * Filter, which AdminEvent to fetch.
     */
    where?: AdminEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminEvents to fetch.
     */
    orderBy?: AdminEventOrderByWithRelationInput | AdminEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminEvents.
     */
    cursor?: AdminEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminEvents.
     */
    distinct?: AdminEventScalarFieldEnum | AdminEventScalarFieldEnum[]
  }

  /**
   * AdminEvent findMany
   */
  export type AdminEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminEvent
     */
    select?: AdminEventSelect<ExtArgs> | null
    /**
     * Filter, which AdminEvents to fetch.
     */
    where?: AdminEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminEvents to fetch.
     */
    orderBy?: AdminEventOrderByWithRelationInput | AdminEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminEvents.
     */
    cursor?: AdminEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminEvents.
     */
    skip?: number
    distinct?: AdminEventScalarFieldEnum | AdminEventScalarFieldEnum[]
  }

  /**
   * AdminEvent create
   */
  export type AdminEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminEvent
     */
    select?: AdminEventSelect<ExtArgs> | null
    /**
     * The data needed to create a AdminEvent.
     */
    data: XOR<AdminEventCreateInput, AdminEventUncheckedCreateInput>
  }

  /**
   * AdminEvent createMany
   */
  export type AdminEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminEvents.
     */
    data: AdminEventCreateManyInput | AdminEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminEvent createManyAndReturn
   */
  export type AdminEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminEvent
     */
    select?: AdminEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AdminEvents.
     */
    data: AdminEventCreateManyInput | AdminEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminEvent update
   */
  export type AdminEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminEvent
     */
    select?: AdminEventSelect<ExtArgs> | null
    /**
     * The data needed to update a AdminEvent.
     */
    data: XOR<AdminEventUpdateInput, AdminEventUncheckedUpdateInput>
    /**
     * Choose, which AdminEvent to update.
     */
    where: AdminEventWhereUniqueInput
  }

  /**
   * AdminEvent updateMany
   */
  export type AdminEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminEvents.
     */
    data: XOR<AdminEventUpdateManyMutationInput, AdminEventUncheckedUpdateManyInput>
    /**
     * Filter which AdminEvents to update
     */
    where?: AdminEventWhereInput
  }

  /**
   * AdminEvent upsert
   */
  export type AdminEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminEvent
     */
    select?: AdminEventSelect<ExtArgs> | null
    /**
     * The filter to search for the AdminEvent to update in case it exists.
     */
    where: AdminEventWhereUniqueInput
    /**
     * In case the AdminEvent found by the `where` argument doesn't exist, create a new AdminEvent with this data.
     */
    create: XOR<AdminEventCreateInput, AdminEventUncheckedCreateInput>
    /**
     * In case the AdminEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminEventUpdateInput, AdminEventUncheckedUpdateInput>
  }

  /**
   * AdminEvent delete
   */
  export type AdminEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminEvent
     */
    select?: AdminEventSelect<ExtArgs> | null
    /**
     * Filter which AdminEvent to delete.
     */
    where: AdminEventWhereUniqueInput
  }

  /**
   * AdminEvent deleteMany
   */
  export type AdminEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminEvents to delete
     */
    where?: AdminEventWhereInput
  }

  /**
   * AdminEvent without action
   */
  export type AdminEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminEvent
     */
    select?: AdminEventSelect<ExtArgs> | null
  }


  /**
   * Model ReadingProgress
   */

  export type AggregateReadingProgress = {
    _count: ReadingProgressCountAggregateOutputType | null
    _avg: ReadingProgressAvgAggregateOutputType | null
    _sum: ReadingProgressSumAggregateOutputType | null
    _min: ReadingProgressMinAggregateOutputType | null
    _max: ReadingProgressMaxAggregateOutputType | null
  }

  export type ReadingProgressAvgAggregateOutputType = {
    progress: number | null
  }

  export type ReadingProgressSumAggregateOutputType = {
    progress: number | null
  }

  export type ReadingProgressMinAggregateOutputType = {
    id: string | null
    userId: string | null
    ebookId: string | null
    currentLocation: string | null
    progress: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReadingProgressMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    ebookId: string | null
    currentLocation: string | null
    progress: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReadingProgressCountAggregateOutputType = {
    id: number
    userId: number
    ebookId: number
    currentLocation: number
    progress: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReadingProgressAvgAggregateInputType = {
    progress?: true
  }

  export type ReadingProgressSumAggregateInputType = {
    progress?: true
  }

  export type ReadingProgressMinAggregateInputType = {
    id?: true
    userId?: true
    ebookId?: true
    currentLocation?: true
    progress?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReadingProgressMaxAggregateInputType = {
    id?: true
    userId?: true
    ebookId?: true
    currentLocation?: true
    progress?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReadingProgressCountAggregateInputType = {
    id?: true
    userId?: true
    ebookId?: true
    currentLocation?: true
    progress?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReadingProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReadingProgress to aggregate.
     */
    where?: ReadingProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingProgresses to fetch.
     */
    orderBy?: ReadingProgressOrderByWithRelationInput | ReadingProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReadingProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReadingProgresses
    **/
    _count?: true | ReadingProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReadingProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReadingProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReadingProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReadingProgressMaxAggregateInputType
  }

  export type GetReadingProgressAggregateType<T extends ReadingProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateReadingProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReadingProgress[P]>
      : GetScalarType<T[P], AggregateReadingProgress[P]>
  }




  export type ReadingProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadingProgressWhereInput
    orderBy?: ReadingProgressOrderByWithAggregationInput | ReadingProgressOrderByWithAggregationInput[]
    by: ReadingProgressScalarFieldEnum[] | ReadingProgressScalarFieldEnum
    having?: ReadingProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReadingProgressCountAggregateInputType | true
    _avg?: ReadingProgressAvgAggregateInputType
    _sum?: ReadingProgressSumAggregateInputType
    _min?: ReadingProgressMinAggregateInputType
    _max?: ReadingProgressMaxAggregateInputType
  }

  export type ReadingProgressGroupByOutputType = {
    id: string
    userId: string
    ebookId: string
    currentLocation: string | null
    progress: number
    createdAt: Date
    updatedAt: Date
    _count: ReadingProgressCountAggregateOutputType | null
    _avg: ReadingProgressAvgAggregateOutputType | null
    _sum: ReadingProgressSumAggregateOutputType | null
    _min: ReadingProgressMinAggregateOutputType | null
    _max: ReadingProgressMaxAggregateOutputType | null
  }

  type GetReadingProgressGroupByPayload<T extends ReadingProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReadingProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReadingProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReadingProgressGroupByOutputType[P]>
            : GetScalarType<T[P], ReadingProgressGroupByOutputType[P]>
        }
      >
    >


  export type ReadingProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ebookId?: boolean
    currentLocation?: boolean
    progress?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["readingProgress"]>

  export type ReadingProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ebookId?: boolean
    currentLocation?: boolean
    progress?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["readingProgress"]>

  export type ReadingProgressSelectScalar = {
    id?: boolean
    userId?: boolean
    ebookId?: boolean
    currentLocation?: boolean
    progress?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReadingProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ReadingProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ReadingProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReadingProgress"
    objects: {
      ebook: Prisma.$EbookPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      ebookId: string
      currentLocation: string | null
      progress: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["readingProgress"]>
    composites: {}
  }

  type ReadingProgressGetPayload<S extends boolean | null | undefined | ReadingProgressDefaultArgs> = $Result.GetResult<Prisma.$ReadingProgressPayload, S>

  type ReadingProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReadingProgressFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReadingProgressCountAggregateInputType | true
    }

  export interface ReadingProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReadingProgress'], meta: { name: 'ReadingProgress' } }
    /**
     * Find zero or one ReadingProgress that matches the filter.
     * @param {ReadingProgressFindUniqueArgs} args - Arguments to find a ReadingProgress
     * @example
     * // Get one ReadingProgress
     * const readingProgress = await prisma.readingProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReadingProgressFindUniqueArgs>(args: SelectSubset<T, ReadingProgressFindUniqueArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ReadingProgress that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReadingProgressFindUniqueOrThrowArgs} args - Arguments to find a ReadingProgress
     * @example
     * // Get one ReadingProgress
     * const readingProgress = await prisma.readingProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReadingProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, ReadingProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ReadingProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingProgressFindFirstArgs} args - Arguments to find a ReadingProgress
     * @example
     * // Get one ReadingProgress
     * const readingProgress = await prisma.readingProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReadingProgressFindFirstArgs>(args?: SelectSubset<T, ReadingProgressFindFirstArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ReadingProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingProgressFindFirstOrThrowArgs} args - Arguments to find a ReadingProgress
     * @example
     * // Get one ReadingProgress
     * const readingProgress = await prisma.readingProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReadingProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, ReadingProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ReadingProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReadingProgresses
     * const readingProgresses = await prisma.readingProgress.findMany()
     * 
     * // Get first 10 ReadingProgresses
     * const readingProgresses = await prisma.readingProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const readingProgressWithIdOnly = await prisma.readingProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReadingProgressFindManyArgs>(args?: SelectSubset<T, ReadingProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ReadingProgress.
     * @param {ReadingProgressCreateArgs} args - Arguments to create a ReadingProgress.
     * @example
     * // Create one ReadingProgress
     * const ReadingProgress = await prisma.readingProgress.create({
     *   data: {
     *     // ... data to create a ReadingProgress
     *   }
     * })
     * 
     */
    create<T extends ReadingProgressCreateArgs>(args: SelectSubset<T, ReadingProgressCreateArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ReadingProgresses.
     * @param {ReadingProgressCreateManyArgs} args - Arguments to create many ReadingProgresses.
     * @example
     * // Create many ReadingProgresses
     * const readingProgress = await prisma.readingProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReadingProgressCreateManyArgs>(args?: SelectSubset<T, ReadingProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReadingProgresses and returns the data saved in the database.
     * @param {ReadingProgressCreateManyAndReturnArgs} args - Arguments to create many ReadingProgresses.
     * @example
     * // Create many ReadingProgresses
     * const readingProgress = await prisma.readingProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReadingProgresses and only return the `id`
     * const readingProgressWithIdOnly = await prisma.readingProgress.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReadingProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, ReadingProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ReadingProgress.
     * @param {ReadingProgressDeleteArgs} args - Arguments to delete one ReadingProgress.
     * @example
     * // Delete one ReadingProgress
     * const ReadingProgress = await prisma.readingProgress.delete({
     *   where: {
     *     // ... filter to delete one ReadingProgress
     *   }
     * })
     * 
     */
    delete<T extends ReadingProgressDeleteArgs>(args: SelectSubset<T, ReadingProgressDeleteArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ReadingProgress.
     * @param {ReadingProgressUpdateArgs} args - Arguments to update one ReadingProgress.
     * @example
     * // Update one ReadingProgress
     * const readingProgress = await prisma.readingProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReadingProgressUpdateArgs>(args: SelectSubset<T, ReadingProgressUpdateArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ReadingProgresses.
     * @param {ReadingProgressDeleteManyArgs} args - Arguments to filter ReadingProgresses to delete.
     * @example
     * // Delete a few ReadingProgresses
     * const { count } = await prisma.readingProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReadingProgressDeleteManyArgs>(args?: SelectSubset<T, ReadingProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReadingProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReadingProgresses
     * const readingProgress = await prisma.readingProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReadingProgressUpdateManyArgs>(args: SelectSubset<T, ReadingProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ReadingProgress.
     * @param {ReadingProgressUpsertArgs} args - Arguments to update or create a ReadingProgress.
     * @example
     * // Update or create a ReadingProgress
     * const readingProgress = await prisma.readingProgress.upsert({
     *   create: {
     *     // ... data to create a ReadingProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReadingProgress we want to update
     *   }
     * })
     */
    upsert<T extends ReadingProgressUpsertArgs>(args: SelectSubset<T, ReadingProgressUpsertArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ReadingProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingProgressCountArgs} args - Arguments to filter ReadingProgresses to count.
     * @example
     * // Count the number of ReadingProgresses
     * const count = await prisma.readingProgress.count({
     *   where: {
     *     // ... the filter for the ReadingProgresses we want to count
     *   }
     * })
    **/
    count<T extends ReadingProgressCountArgs>(
      args?: Subset<T, ReadingProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReadingProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReadingProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReadingProgressAggregateArgs>(args: Subset<T, ReadingProgressAggregateArgs>): Prisma.PrismaPromise<GetReadingProgressAggregateType<T>>

    /**
     * Group by ReadingProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingProgressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReadingProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReadingProgressGroupByArgs['orderBy'] }
        : { orderBy?: ReadingProgressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReadingProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReadingProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReadingProgress model
   */
  readonly fields: ReadingProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReadingProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReadingProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ebook<T extends EbookDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EbookDefaultArgs<ExtArgs>>): Prisma__EbookClient<$Result.GetResult<Prisma.$EbookPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReadingProgress model
   */ 
  interface ReadingProgressFieldRefs {
    readonly id: FieldRef<"ReadingProgress", 'String'>
    readonly userId: FieldRef<"ReadingProgress", 'String'>
    readonly ebookId: FieldRef<"ReadingProgress", 'String'>
    readonly currentLocation: FieldRef<"ReadingProgress", 'String'>
    readonly progress: FieldRef<"ReadingProgress", 'Float'>
    readonly createdAt: FieldRef<"ReadingProgress", 'DateTime'>
    readonly updatedAt: FieldRef<"ReadingProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReadingProgress findUnique
   */
  export type ReadingProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * Filter, which ReadingProgress to fetch.
     */
    where: ReadingProgressWhereUniqueInput
  }

  /**
   * ReadingProgress findUniqueOrThrow
   */
  export type ReadingProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * Filter, which ReadingProgress to fetch.
     */
    where: ReadingProgressWhereUniqueInput
  }

  /**
   * ReadingProgress findFirst
   */
  export type ReadingProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * Filter, which ReadingProgress to fetch.
     */
    where?: ReadingProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingProgresses to fetch.
     */
    orderBy?: ReadingProgressOrderByWithRelationInput | ReadingProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReadingProgresses.
     */
    cursor?: ReadingProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReadingProgresses.
     */
    distinct?: ReadingProgressScalarFieldEnum | ReadingProgressScalarFieldEnum[]
  }

  /**
   * ReadingProgress findFirstOrThrow
   */
  export type ReadingProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * Filter, which ReadingProgress to fetch.
     */
    where?: ReadingProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingProgresses to fetch.
     */
    orderBy?: ReadingProgressOrderByWithRelationInput | ReadingProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReadingProgresses.
     */
    cursor?: ReadingProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReadingProgresses.
     */
    distinct?: ReadingProgressScalarFieldEnum | ReadingProgressScalarFieldEnum[]
  }

  /**
   * ReadingProgress findMany
   */
  export type ReadingProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * Filter, which ReadingProgresses to fetch.
     */
    where?: ReadingProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingProgresses to fetch.
     */
    orderBy?: ReadingProgressOrderByWithRelationInput | ReadingProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReadingProgresses.
     */
    cursor?: ReadingProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingProgresses.
     */
    skip?: number
    distinct?: ReadingProgressScalarFieldEnum | ReadingProgressScalarFieldEnum[]
  }

  /**
   * ReadingProgress create
   */
  export type ReadingProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a ReadingProgress.
     */
    data: XOR<ReadingProgressCreateInput, ReadingProgressUncheckedCreateInput>
  }

  /**
   * ReadingProgress createMany
   */
  export type ReadingProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReadingProgresses.
     */
    data: ReadingProgressCreateManyInput | ReadingProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReadingProgress createManyAndReturn
   */
  export type ReadingProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ReadingProgresses.
     */
    data: ReadingProgressCreateManyInput | ReadingProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReadingProgress update
   */
  export type ReadingProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a ReadingProgress.
     */
    data: XOR<ReadingProgressUpdateInput, ReadingProgressUncheckedUpdateInput>
    /**
     * Choose, which ReadingProgress to update.
     */
    where: ReadingProgressWhereUniqueInput
  }

  /**
   * ReadingProgress updateMany
   */
  export type ReadingProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReadingProgresses.
     */
    data: XOR<ReadingProgressUpdateManyMutationInput, ReadingProgressUncheckedUpdateManyInput>
    /**
     * Filter which ReadingProgresses to update
     */
    where?: ReadingProgressWhereInput
  }

  /**
   * ReadingProgress upsert
   */
  export type ReadingProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the ReadingProgress to update in case it exists.
     */
    where: ReadingProgressWhereUniqueInput
    /**
     * In case the ReadingProgress found by the `where` argument doesn't exist, create a new ReadingProgress with this data.
     */
    create: XOR<ReadingProgressCreateInput, ReadingProgressUncheckedCreateInput>
    /**
     * In case the ReadingProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReadingProgressUpdateInput, ReadingProgressUncheckedUpdateInput>
  }

  /**
   * ReadingProgress delete
   */
  export type ReadingProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * Filter which ReadingProgress to delete.
     */
    where: ReadingProgressWhereUniqueInput
  }

  /**
   * ReadingProgress deleteMany
   */
  export type ReadingProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReadingProgresses to delete
     */
    where?: ReadingProgressWhereInput
  }

  /**
   * ReadingProgress without action
   */
  export type ReadingProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
  }


  /**
   * Model Annotation
   */

  export type AggregateAnnotation = {
    _count: AnnotationCountAggregateOutputType | null
    _min: AnnotationMinAggregateOutputType | null
    _max: AnnotationMaxAggregateOutputType | null
  }

  export type AnnotationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    ebookId: string | null
    cfiRange: string | null
    text: string | null
    type: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AnnotationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    ebookId: string | null
    cfiRange: string | null
    text: string | null
    type: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AnnotationCountAggregateOutputType = {
    id: number
    userId: number
    ebookId: number
    cfiRange: number
    text: number
    type: number
    color: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AnnotationMinAggregateInputType = {
    id?: true
    userId?: true
    ebookId?: true
    cfiRange?: true
    text?: true
    type?: true
    color?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AnnotationMaxAggregateInputType = {
    id?: true
    userId?: true
    ebookId?: true
    cfiRange?: true
    text?: true
    type?: true
    color?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AnnotationCountAggregateInputType = {
    id?: true
    userId?: true
    ebookId?: true
    cfiRange?: true
    text?: true
    type?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AnnotationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Annotation to aggregate.
     */
    where?: AnnotationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Annotations to fetch.
     */
    orderBy?: AnnotationOrderByWithRelationInput | AnnotationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnnotationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Annotations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Annotations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Annotations
    **/
    _count?: true | AnnotationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnnotationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnnotationMaxAggregateInputType
  }

  export type GetAnnotationAggregateType<T extends AnnotationAggregateArgs> = {
        [P in keyof T & keyof AggregateAnnotation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnnotation[P]>
      : GetScalarType<T[P], AggregateAnnotation[P]>
  }




  export type AnnotationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnnotationWhereInput
    orderBy?: AnnotationOrderByWithAggregationInput | AnnotationOrderByWithAggregationInput[]
    by: AnnotationScalarFieldEnum[] | AnnotationScalarFieldEnum
    having?: AnnotationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnnotationCountAggregateInputType | true
    _min?: AnnotationMinAggregateInputType
    _max?: AnnotationMaxAggregateInputType
  }

  export type AnnotationGroupByOutputType = {
    id: string
    userId: string
    ebookId: string
    cfiRange: string
    text: string
    type: string
    color: string | null
    createdAt: Date
    updatedAt: Date
    _count: AnnotationCountAggregateOutputType | null
    _min: AnnotationMinAggregateOutputType | null
    _max: AnnotationMaxAggregateOutputType | null
  }

  type GetAnnotationGroupByPayload<T extends AnnotationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnnotationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnnotationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnnotationGroupByOutputType[P]>
            : GetScalarType<T[P], AnnotationGroupByOutputType[P]>
        }
      >
    >


  export type AnnotationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ebookId?: boolean
    cfiRange?: boolean
    text?: boolean
    type?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["annotation"]>

  export type AnnotationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ebookId?: boolean
    cfiRange?: boolean
    text?: boolean
    type?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["annotation"]>

  export type AnnotationSelectScalar = {
    id?: boolean
    userId?: boolean
    ebookId?: boolean
    cfiRange?: boolean
    text?: boolean
    type?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AnnotationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
  }
  export type AnnotationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
  }

  export type $AnnotationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Annotation"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      ebook: Prisma.$EbookPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      ebookId: string
      cfiRange: string
      text: string
      type: string
      color: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["annotation"]>
    composites: {}
  }

  type AnnotationGetPayload<S extends boolean | null | undefined | AnnotationDefaultArgs> = $Result.GetResult<Prisma.$AnnotationPayload, S>

  type AnnotationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AnnotationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AnnotationCountAggregateInputType | true
    }

  export interface AnnotationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Annotation'], meta: { name: 'Annotation' } }
    /**
     * Find zero or one Annotation that matches the filter.
     * @param {AnnotationFindUniqueArgs} args - Arguments to find a Annotation
     * @example
     * // Get one Annotation
     * const annotation = await prisma.annotation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnnotationFindUniqueArgs>(args: SelectSubset<T, AnnotationFindUniqueArgs<ExtArgs>>): Prisma__AnnotationClient<$Result.GetResult<Prisma.$AnnotationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Annotation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AnnotationFindUniqueOrThrowArgs} args - Arguments to find a Annotation
     * @example
     * // Get one Annotation
     * const annotation = await prisma.annotation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnnotationFindUniqueOrThrowArgs>(args: SelectSubset<T, AnnotationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnnotationClient<$Result.GetResult<Prisma.$AnnotationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Annotation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnotationFindFirstArgs} args - Arguments to find a Annotation
     * @example
     * // Get one Annotation
     * const annotation = await prisma.annotation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnnotationFindFirstArgs>(args?: SelectSubset<T, AnnotationFindFirstArgs<ExtArgs>>): Prisma__AnnotationClient<$Result.GetResult<Prisma.$AnnotationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Annotation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnotationFindFirstOrThrowArgs} args - Arguments to find a Annotation
     * @example
     * // Get one Annotation
     * const annotation = await prisma.annotation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnnotationFindFirstOrThrowArgs>(args?: SelectSubset<T, AnnotationFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnnotationClient<$Result.GetResult<Prisma.$AnnotationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Annotations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnotationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Annotations
     * const annotations = await prisma.annotation.findMany()
     * 
     * // Get first 10 Annotations
     * const annotations = await prisma.annotation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const annotationWithIdOnly = await prisma.annotation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnnotationFindManyArgs>(args?: SelectSubset<T, AnnotationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnotationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Annotation.
     * @param {AnnotationCreateArgs} args - Arguments to create a Annotation.
     * @example
     * // Create one Annotation
     * const Annotation = await prisma.annotation.create({
     *   data: {
     *     // ... data to create a Annotation
     *   }
     * })
     * 
     */
    create<T extends AnnotationCreateArgs>(args: SelectSubset<T, AnnotationCreateArgs<ExtArgs>>): Prisma__AnnotationClient<$Result.GetResult<Prisma.$AnnotationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Annotations.
     * @param {AnnotationCreateManyArgs} args - Arguments to create many Annotations.
     * @example
     * // Create many Annotations
     * const annotation = await prisma.annotation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnnotationCreateManyArgs>(args?: SelectSubset<T, AnnotationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Annotations and returns the data saved in the database.
     * @param {AnnotationCreateManyAndReturnArgs} args - Arguments to create many Annotations.
     * @example
     * // Create many Annotations
     * const annotation = await prisma.annotation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Annotations and only return the `id`
     * const annotationWithIdOnly = await prisma.annotation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnnotationCreateManyAndReturnArgs>(args?: SelectSubset<T, AnnotationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnotationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Annotation.
     * @param {AnnotationDeleteArgs} args - Arguments to delete one Annotation.
     * @example
     * // Delete one Annotation
     * const Annotation = await prisma.annotation.delete({
     *   where: {
     *     // ... filter to delete one Annotation
     *   }
     * })
     * 
     */
    delete<T extends AnnotationDeleteArgs>(args: SelectSubset<T, AnnotationDeleteArgs<ExtArgs>>): Prisma__AnnotationClient<$Result.GetResult<Prisma.$AnnotationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Annotation.
     * @param {AnnotationUpdateArgs} args - Arguments to update one Annotation.
     * @example
     * // Update one Annotation
     * const annotation = await prisma.annotation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnnotationUpdateArgs>(args: SelectSubset<T, AnnotationUpdateArgs<ExtArgs>>): Prisma__AnnotationClient<$Result.GetResult<Prisma.$AnnotationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Annotations.
     * @param {AnnotationDeleteManyArgs} args - Arguments to filter Annotations to delete.
     * @example
     * // Delete a few Annotations
     * const { count } = await prisma.annotation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnnotationDeleteManyArgs>(args?: SelectSubset<T, AnnotationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Annotations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnotationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Annotations
     * const annotation = await prisma.annotation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnnotationUpdateManyArgs>(args: SelectSubset<T, AnnotationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Annotation.
     * @param {AnnotationUpsertArgs} args - Arguments to update or create a Annotation.
     * @example
     * // Update or create a Annotation
     * const annotation = await prisma.annotation.upsert({
     *   create: {
     *     // ... data to create a Annotation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Annotation we want to update
     *   }
     * })
     */
    upsert<T extends AnnotationUpsertArgs>(args: SelectSubset<T, AnnotationUpsertArgs<ExtArgs>>): Prisma__AnnotationClient<$Result.GetResult<Prisma.$AnnotationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Annotations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnotationCountArgs} args - Arguments to filter Annotations to count.
     * @example
     * // Count the number of Annotations
     * const count = await prisma.annotation.count({
     *   where: {
     *     // ... the filter for the Annotations we want to count
     *   }
     * })
    **/
    count<T extends AnnotationCountArgs>(
      args?: Subset<T, AnnotationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnnotationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Annotation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnotationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnnotationAggregateArgs>(args: Subset<T, AnnotationAggregateArgs>): Prisma.PrismaPromise<GetAnnotationAggregateType<T>>

    /**
     * Group by Annotation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnotationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnnotationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnnotationGroupByArgs['orderBy'] }
        : { orderBy?: AnnotationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnnotationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnnotationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Annotation model
   */
  readonly fields: AnnotationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Annotation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnnotationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    ebook<T extends EbookDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EbookDefaultArgs<ExtArgs>>): Prisma__EbookClient<$Result.GetResult<Prisma.$EbookPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Annotation model
   */ 
  interface AnnotationFieldRefs {
    readonly id: FieldRef<"Annotation", 'String'>
    readonly userId: FieldRef<"Annotation", 'String'>
    readonly ebookId: FieldRef<"Annotation", 'String'>
    readonly cfiRange: FieldRef<"Annotation", 'String'>
    readonly text: FieldRef<"Annotation", 'String'>
    readonly type: FieldRef<"Annotation", 'String'>
    readonly color: FieldRef<"Annotation", 'String'>
    readonly createdAt: FieldRef<"Annotation", 'DateTime'>
    readonly updatedAt: FieldRef<"Annotation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Annotation findUnique
   */
  export type AnnotationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Annotation
     */
    select?: AnnotationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnotationInclude<ExtArgs> | null
    /**
     * Filter, which Annotation to fetch.
     */
    where: AnnotationWhereUniqueInput
  }

  /**
   * Annotation findUniqueOrThrow
   */
  export type AnnotationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Annotation
     */
    select?: AnnotationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnotationInclude<ExtArgs> | null
    /**
     * Filter, which Annotation to fetch.
     */
    where: AnnotationWhereUniqueInput
  }

  /**
   * Annotation findFirst
   */
  export type AnnotationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Annotation
     */
    select?: AnnotationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnotationInclude<ExtArgs> | null
    /**
     * Filter, which Annotation to fetch.
     */
    where?: AnnotationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Annotations to fetch.
     */
    orderBy?: AnnotationOrderByWithRelationInput | AnnotationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Annotations.
     */
    cursor?: AnnotationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Annotations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Annotations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Annotations.
     */
    distinct?: AnnotationScalarFieldEnum | AnnotationScalarFieldEnum[]
  }

  /**
   * Annotation findFirstOrThrow
   */
  export type AnnotationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Annotation
     */
    select?: AnnotationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnotationInclude<ExtArgs> | null
    /**
     * Filter, which Annotation to fetch.
     */
    where?: AnnotationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Annotations to fetch.
     */
    orderBy?: AnnotationOrderByWithRelationInput | AnnotationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Annotations.
     */
    cursor?: AnnotationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Annotations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Annotations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Annotations.
     */
    distinct?: AnnotationScalarFieldEnum | AnnotationScalarFieldEnum[]
  }

  /**
   * Annotation findMany
   */
  export type AnnotationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Annotation
     */
    select?: AnnotationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnotationInclude<ExtArgs> | null
    /**
     * Filter, which Annotations to fetch.
     */
    where?: AnnotationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Annotations to fetch.
     */
    orderBy?: AnnotationOrderByWithRelationInput | AnnotationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Annotations.
     */
    cursor?: AnnotationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Annotations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Annotations.
     */
    skip?: number
    distinct?: AnnotationScalarFieldEnum | AnnotationScalarFieldEnum[]
  }

  /**
   * Annotation create
   */
  export type AnnotationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Annotation
     */
    select?: AnnotationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnotationInclude<ExtArgs> | null
    /**
     * The data needed to create a Annotation.
     */
    data: XOR<AnnotationCreateInput, AnnotationUncheckedCreateInput>
  }

  /**
   * Annotation createMany
   */
  export type AnnotationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Annotations.
     */
    data: AnnotationCreateManyInput | AnnotationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Annotation createManyAndReturn
   */
  export type AnnotationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Annotation
     */
    select?: AnnotationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Annotations.
     */
    data: AnnotationCreateManyInput | AnnotationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnotationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Annotation update
   */
  export type AnnotationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Annotation
     */
    select?: AnnotationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnotationInclude<ExtArgs> | null
    /**
     * The data needed to update a Annotation.
     */
    data: XOR<AnnotationUpdateInput, AnnotationUncheckedUpdateInput>
    /**
     * Choose, which Annotation to update.
     */
    where: AnnotationWhereUniqueInput
  }

  /**
   * Annotation updateMany
   */
  export type AnnotationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Annotations.
     */
    data: XOR<AnnotationUpdateManyMutationInput, AnnotationUncheckedUpdateManyInput>
    /**
     * Filter which Annotations to update
     */
    where?: AnnotationWhereInput
  }

  /**
   * Annotation upsert
   */
  export type AnnotationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Annotation
     */
    select?: AnnotationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnotationInclude<ExtArgs> | null
    /**
     * The filter to search for the Annotation to update in case it exists.
     */
    where: AnnotationWhereUniqueInput
    /**
     * In case the Annotation found by the `where` argument doesn't exist, create a new Annotation with this data.
     */
    create: XOR<AnnotationCreateInput, AnnotationUncheckedCreateInput>
    /**
     * In case the Annotation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnnotationUpdateInput, AnnotationUncheckedUpdateInput>
  }

  /**
   * Annotation delete
   */
  export type AnnotationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Annotation
     */
    select?: AnnotationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnotationInclude<ExtArgs> | null
    /**
     * Filter which Annotation to delete.
     */
    where: AnnotationWhereUniqueInput
  }

  /**
   * Annotation deleteMany
   */
  export type AnnotationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Annotations to delete
     */
    where?: AnnotationWhereInput
  }

  /**
   * Annotation without action
   */
  export type AnnotationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Annotation
     */
    select?: AnnotationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnotationInclude<ExtArgs> | null
  }


  /**
   * Model Readlist
   */

  export type AggregateReadlist = {
    _count: ReadlistCountAggregateOutputType | null
    _min: ReadlistMinAggregateOutputType | null
    _max: ReadlistMaxAggregateOutputType | null
  }

  export type ReadlistMinAggregateOutputType = {
    id: string | null
    userId: string | null
    ebookId: string | null
    status: $Enums.ReadlistStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReadlistMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    ebookId: string | null
    status: $Enums.ReadlistStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReadlistCountAggregateOutputType = {
    id: number
    userId: number
    ebookId: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReadlistMinAggregateInputType = {
    id?: true
    userId?: true
    ebookId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReadlistMaxAggregateInputType = {
    id?: true
    userId?: true
    ebookId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReadlistCountAggregateInputType = {
    id?: true
    userId?: true
    ebookId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReadlistAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Readlist to aggregate.
     */
    where?: ReadlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Readlists to fetch.
     */
    orderBy?: ReadlistOrderByWithRelationInput | ReadlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReadlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Readlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Readlists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Readlists
    **/
    _count?: true | ReadlistCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReadlistMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReadlistMaxAggregateInputType
  }

  export type GetReadlistAggregateType<T extends ReadlistAggregateArgs> = {
        [P in keyof T & keyof AggregateReadlist]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReadlist[P]>
      : GetScalarType<T[P], AggregateReadlist[P]>
  }




  export type ReadlistGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadlistWhereInput
    orderBy?: ReadlistOrderByWithAggregationInput | ReadlistOrderByWithAggregationInput[]
    by: ReadlistScalarFieldEnum[] | ReadlistScalarFieldEnum
    having?: ReadlistScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReadlistCountAggregateInputType | true
    _min?: ReadlistMinAggregateInputType
    _max?: ReadlistMaxAggregateInputType
  }

  export type ReadlistGroupByOutputType = {
    id: string
    userId: string
    ebookId: string
    status: $Enums.ReadlistStatus
    createdAt: Date
    updatedAt: Date
    _count: ReadlistCountAggregateOutputType | null
    _min: ReadlistMinAggregateOutputType | null
    _max: ReadlistMaxAggregateOutputType | null
  }

  type GetReadlistGroupByPayload<T extends ReadlistGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReadlistGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReadlistGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReadlistGroupByOutputType[P]>
            : GetScalarType<T[P], ReadlistGroupByOutputType[P]>
        }
      >
    >


  export type ReadlistSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ebookId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["readlist"]>

  export type ReadlistSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ebookId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["readlist"]>

  export type ReadlistSelectScalar = {
    id?: boolean
    userId?: boolean
    ebookId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReadlistInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ReadlistIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ebook?: boolean | EbookDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ReadlistPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Readlist"
    objects: {
      ebook: Prisma.$EbookPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      ebookId: string
      status: $Enums.ReadlistStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["readlist"]>
    composites: {}
  }

  type ReadlistGetPayload<S extends boolean | null | undefined | ReadlistDefaultArgs> = $Result.GetResult<Prisma.$ReadlistPayload, S>

  type ReadlistCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReadlistFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReadlistCountAggregateInputType | true
    }

  export interface ReadlistDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Readlist'], meta: { name: 'Readlist' } }
    /**
     * Find zero or one Readlist that matches the filter.
     * @param {ReadlistFindUniqueArgs} args - Arguments to find a Readlist
     * @example
     * // Get one Readlist
     * const readlist = await prisma.readlist.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReadlistFindUniqueArgs>(args: SelectSubset<T, ReadlistFindUniqueArgs<ExtArgs>>): Prisma__ReadlistClient<$Result.GetResult<Prisma.$ReadlistPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Readlist that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReadlistFindUniqueOrThrowArgs} args - Arguments to find a Readlist
     * @example
     * // Get one Readlist
     * const readlist = await prisma.readlist.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReadlistFindUniqueOrThrowArgs>(args: SelectSubset<T, ReadlistFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReadlistClient<$Result.GetResult<Prisma.$ReadlistPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Readlist that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadlistFindFirstArgs} args - Arguments to find a Readlist
     * @example
     * // Get one Readlist
     * const readlist = await prisma.readlist.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReadlistFindFirstArgs>(args?: SelectSubset<T, ReadlistFindFirstArgs<ExtArgs>>): Prisma__ReadlistClient<$Result.GetResult<Prisma.$ReadlistPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Readlist that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadlistFindFirstOrThrowArgs} args - Arguments to find a Readlist
     * @example
     * // Get one Readlist
     * const readlist = await prisma.readlist.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReadlistFindFirstOrThrowArgs>(args?: SelectSubset<T, ReadlistFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReadlistClient<$Result.GetResult<Prisma.$ReadlistPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Readlists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadlistFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Readlists
     * const readlists = await prisma.readlist.findMany()
     * 
     * // Get first 10 Readlists
     * const readlists = await prisma.readlist.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const readlistWithIdOnly = await prisma.readlist.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReadlistFindManyArgs>(args?: SelectSubset<T, ReadlistFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadlistPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Readlist.
     * @param {ReadlistCreateArgs} args - Arguments to create a Readlist.
     * @example
     * // Create one Readlist
     * const Readlist = await prisma.readlist.create({
     *   data: {
     *     // ... data to create a Readlist
     *   }
     * })
     * 
     */
    create<T extends ReadlistCreateArgs>(args: SelectSubset<T, ReadlistCreateArgs<ExtArgs>>): Prisma__ReadlistClient<$Result.GetResult<Prisma.$ReadlistPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Readlists.
     * @param {ReadlistCreateManyArgs} args - Arguments to create many Readlists.
     * @example
     * // Create many Readlists
     * const readlist = await prisma.readlist.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReadlistCreateManyArgs>(args?: SelectSubset<T, ReadlistCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Readlists and returns the data saved in the database.
     * @param {ReadlistCreateManyAndReturnArgs} args - Arguments to create many Readlists.
     * @example
     * // Create many Readlists
     * const readlist = await prisma.readlist.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Readlists and only return the `id`
     * const readlistWithIdOnly = await prisma.readlist.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReadlistCreateManyAndReturnArgs>(args?: SelectSubset<T, ReadlistCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadlistPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Readlist.
     * @param {ReadlistDeleteArgs} args - Arguments to delete one Readlist.
     * @example
     * // Delete one Readlist
     * const Readlist = await prisma.readlist.delete({
     *   where: {
     *     // ... filter to delete one Readlist
     *   }
     * })
     * 
     */
    delete<T extends ReadlistDeleteArgs>(args: SelectSubset<T, ReadlistDeleteArgs<ExtArgs>>): Prisma__ReadlistClient<$Result.GetResult<Prisma.$ReadlistPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Readlist.
     * @param {ReadlistUpdateArgs} args - Arguments to update one Readlist.
     * @example
     * // Update one Readlist
     * const readlist = await prisma.readlist.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReadlistUpdateArgs>(args: SelectSubset<T, ReadlistUpdateArgs<ExtArgs>>): Prisma__ReadlistClient<$Result.GetResult<Prisma.$ReadlistPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Readlists.
     * @param {ReadlistDeleteManyArgs} args - Arguments to filter Readlists to delete.
     * @example
     * // Delete a few Readlists
     * const { count } = await prisma.readlist.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReadlistDeleteManyArgs>(args?: SelectSubset<T, ReadlistDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Readlists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadlistUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Readlists
     * const readlist = await prisma.readlist.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReadlistUpdateManyArgs>(args: SelectSubset<T, ReadlistUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Readlist.
     * @param {ReadlistUpsertArgs} args - Arguments to update or create a Readlist.
     * @example
     * // Update or create a Readlist
     * const readlist = await prisma.readlist.upsert({
     *   create: {
     *     // ... data to create a Readlist
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Readlist we want to update
     *   }
     * })
     */
    upsert<T extends ReadlistUpsertArgs>(args: SelectSubset<T, ReadlistUpsertArgs<ExtArgs>>): Prisma__ReadlistClient<$Result.GetResult<Prisma.$ReadlistPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Readlists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadlistCountArgs} args - Arguments to filter Readlists to count.
     * @example
     * // Count the number of Readlists
     * const count = await prisma.readlist.count({
     *   where: {
     *     // ... the filter for the Readlists we want to count
     *   }
     * })
    **/
    count<T extends ReadlistCountArgs>(
      args?: Subset<T, ReadlistCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReadlistCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Readlist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadlistAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReadlistAggregateArgs>(args: Subset<T, ReadlistAggregateArgs>): Prisma.PrismaPromise<GetReadlistAggregateType<T>>

    /**
     * Group by Readlist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadlistGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReadlistGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReadlistGroupByArgs['orderBy'] }
        : { orderBy?: ReadlistGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReadlistGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReadlistGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Readlist model
   */
  readonly fields: ReadlistFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Readlist.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReadlistClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ebook<T extends EbookDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EbookDefaultArgs<ExtArgs>>): Prisma__EbookClient<$Result.GetResult<Prisma.$EbookPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Readlist model
   */ 
  interface ReadlistFieldRefs {
    readonly id: FieldRef<"Readlist", 'String'>
    readonly userId: FieldRef<"Readlist", 'String'>
    readonly ebookId: FieldRef<"Readlist", 'String'>
    readonly status: FieldRef<"Readlist", 'ReadlistStatus'>
    readonly createdAt: FieldRef<"Readlist", 'DateTime'>
    readonly updatedAt: FieldRef<"Readlist", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Readlist findUnique
   */
  export type ReadlistFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Readlist
     */
    select?: ReadlistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadlistInclude<ExtArgs> | null
    /**
     * Filter, which Readlist to fetch.
     */
    where: ReadlistWhereUniqueInput
  }

  /**
   * Readlist findUniqueOrThrow
   */
  export type ReadlistFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Readlist
     */
    select?: ReadlistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadlistInclude<ExtArgs> | null
    /**
     * Filter, which Readlist to fetch.
     */
    where: ReadlistWhereUniqueInput
  }

  /**
   * Readlist findFirst
   */
  export type ReadlistFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Readlist
     */
    select?: ReadlistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadlistInclude<ExtArgs> | null
    /**
     * Filter, which Readlist to fetch.
     */
    where?: ReadlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Readlists to fetch.
     */
    orderBy?: ReadlistOrderByWithRelationInput | ReadlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Readlists.
     */
    cursor?: ReadlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Readlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Readlists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Readlists.
     */
    distinct?: ReadlistScalarFieldEnum | ReadlistScalarFieldEnum[]
  }

  /**
   * Readlist findFirstOrThrow
   */
  export type ReadlistFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Readlist
     */
    select?: ReadlistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadlistInclude<ExtArgs> | null
    /**
     * Filter, which Readlist to fetch.
     */
    where?: ReadlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Readlists to fetch.
     */
    orderBy?: ReadlistOrderByWithRelationInput | ReadlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Readlists.
     */
    cursor?: ReadlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Readlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Readlists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Readlists.
     */
    distinct?: ReadlistScalarFieldEnum | ReadlistScalarFieldEnum[]
  }

  /**
   * Readlist findMany
   */
  export type ReadlistFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Readlist
     */
    select?: ReadlistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadlistInclude<ExtArgs> | null
    /**
     * Filter, which Readlists to fetch.
     */
    where?: ReadlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Readlists to fetch.
     */
    orderBy?: ReadlistOrderByWithRelationInput | ReadlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Readlists.
     */
    cursor?: ReadlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Readlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Readlists.
     */
    skip?: number
    distinct?: ReadlistScalarFieldEnum | ReadlistScalarFieldEnum[]
  }

  /**
   * Readlist create
   */
  export type ReadlistCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Readlist
     */
    select?: ReadlistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadlistInclude<ExtArgs> | null
    /**
     * The data needed to create a Readlist.
     */
    data: XOR<ReadlistCreateInput, ReadlistUncheckedCreateInput>
  }

  /**
   * Readlist createMany
   */
  export type ReadlistCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Readlists.
     */
    data: ReadlistCreateManyInput | ReadlistCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Readlist createManyAndReturn
   */
  export type ReadlistCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Readlist
     */
    select?: ReadlistSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Readlists.
     */
    data: ReadlistCreateManyInput | ReadlistCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadlistIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Readlist update
   */
  export type ReadlistUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Readlist
     */
    select?: ReadlistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadlistInclude<ExtArgs> | null
    /**
     * The data needed to update a Readlist.
     */
    data: XOR<ReadlistUpdateInput, ReadlistUncheckedUpdateInput>
    /**
     * Choose, which Readlist to update.
     */
    where: ReadlistWhereUniqueInput
  }

  /**
   * Readlist updateMany
   */
  export type ReadlistUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Readlists.
     */
    data: XOR<ReadlistUpdateManyMutationInput, ReadlistUncheckedUpdateManyInput>
    /**
     * Filter which Readlists to update
     */
    where?: ReadlistWhereInput
  }

  /**
   * Readlist upsert
   */
  export type ReadlistUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Readlist
     */
    select?: ReadlistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadlistInclude<ExtArgs> | null
    /**
     * The filter to search for the Readlist to update in case it exists.
     */
    where: ReadlistWhereUniqueInput
    /**
     * In case the Readlist found by the `where` argument doesn't exist, create a new Readlist with this data.
     */
    create: XOR<ReadlistCreateInput, ReadlistUncheckedCreateInput>
    /**
     * In case the Readlist was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReadlistUpdateInput, ReadlistUncheckedUpdateInput>
  }

  /**
   * Readlist delete
   */
  export type ReadlistDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Readlist
     */
    select?: ReadlistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadlistInclude<ExtArgs> | null
    /**
     * Filter which Readlist to delete.
     */
    where: ReadlistWhereUniqueInput
  }

  /**
   * Readlist deleteMany
   */
  export type ReadlistDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Readlists to delete
     */
    where?: ReadlistWhereInput
  }

  /**
   * Readlist without action
   */
  export type ReadlistDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Readlist
     */
    select?: ReadlistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadlistInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    firebaseUid: 'firebaseUid',
    email: 'email',
    name: 'name',
    photoUrl: 'photoUrl',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    status: 'status',
    planName: 'planName',
    startDate: 'startDate',
    endDate: 'endDate',
    orderId: 'orderId',
    transactionId: 'transactionId',
    grossAmount: 'grossAmount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    subscriptionId: 'subscriptionId',
    orderId: 'orderId',
    transactionStatus: 'transactionStatus',
    grossAmount: 'grossAmount',
    paymentType: 'paymentType',
    transactionTime: 'transactionTime',
    settlementTime: 'settlementTime',
    webhookPayload: 'webhookPayload',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const EbookScalarFieldEnum: {
    id: 'id',
    title: 'title',
    author: 'author',
    description: 'description',
    coverUrl: 'coverUrl',
    pdfUrl: 'pdfUrl',
    publicId: 'publicId',
    category: 'category',
    categoryId: 'categoryId',
    isPremium: 'isPremium',
    isActive: 'isActive',
    priority: 'priority',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EbookScalarFieldEnum = (typeof EbookScalarFieldEnum)[keyof typeof EbookScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    icon: 'icon',
    description: 'description',
    displayOrder: 'displayOrder',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const BannerScalarFieldEnum: {
    id: 'id',
    title: 'title',
    subtitle: 'subtitle',
    ctaLabel: 'ctaLabel',
    ctaLink: 'ctaLink',
    imageUrl: 'imageUrl',
    isActive: 'isActive',
    priority: 'priority',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BannerScalarFieldEnum = (typeof BannerScalarFieldEnum)[keyof typeof BannerScalarFieldEnum]


  export const ReadingLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    ebookId: 'ebookId',
    startedAt: 'startedAt',
    lastReadAt: 'lastReadAt'
  };

  export type ReadingLogScalarFieldEnum = (typeof ReadingLogScalarFieldEnum)[keyof typeof ReadingLogScalarFieldEnum]


  export const AdminEventScalarFieldEnum: {
    id: 'id',
    type: 'type',
    title: 'title',
    description: 'description',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type AdminEventScalarFieldEnum = (typeof AdminEventScalarFieldEnum)[keyof typeof AdminEventScalarFieldEnum]


  export const ReadingProgressScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    ebookId: 'ebookId',
    currentLocation: 'currentLocation',
    progress: 'progress',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ReadingProgressScalarFieldEnum = (typeof ReadingProgressScalarFieldEnum)[keyof typeof ReadingProgressScalarFieldEnum]


  export const AnnotationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    ebookId: 'ebookId',
    cfiRange: 'cfiRange',
    text: 'text',
    type: 'type',
    color: 'color',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AnnotationScalarFieldEnum = (typeof AnnotationScalarFieldEnum)[keyof typeof AnnotationScalarFieldEnum]


  export const ReadlistScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    ebookId: 'ebookId',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ReadlistScalarFieldEnum = (typeof ReadlistScalarFieldEnum)[keyof typeof ReadlistScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus'
   */
  export type EnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus[]'
   */
  export type ListEnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'TransactionStatus'
   */
  export type EnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionStatus'>
    


  /**
   * Reference to a field of type 'TransactionStatus[]'
   */
  export type ListEnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'ReadlistStatus'
   */
  export type EnumReadlistStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReadlistStatus'>
    


  /**
   * Reference to a field of type 'ReadlistStatus[]'
   */
  export type ListEnumReadlistStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReadlistStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    firebaseUid?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    photoUrl?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    readingLogs?: ReadingLogListRelationFilter
    readingProgress?: ReadingProgressListRelationFilter
    readlist?: ReadlistListRelationFilter
    subscription?: XOR<SubscriptionNullableRelationFilter, SubscriptionWhereInput> | null
    annotations?: AnnotationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    photoUrl?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    readingLogs?: ReadingLogOrderByRelationAggregateInput
    readingProgress?: ReadingProgressOrderByRelationAggregateInput
    readlist?: ReadlistOrderByRelationAggregateInput
    subscription?: SubscriptionOrderByWithRelationInput
    annotations?: AnnotationOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    firebaseUid?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    photoUrl?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    readingLogs?: ReadingLogListRelationFilter
    readingProgress?: ReadingProgressListRelationFilter
    readlist?: ReadlistListRelationFilter
    subscription?: XOR<SubscriptionNullableRelationFilter, SubscriptionWhereInput> | null
    annotations?: AnnotationListRelationFilter
  }, "id" | "firebaseUid" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    photoUrl?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    firebaseUid?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    photoUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type SubscriptionWhereInput = {
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    id?: StringFilter<"Subscription"> | string
    userId?: StringFilter<"Subscription"> | string
    status?: EnumSubscriptionStatusFilter<"Subscription"> | $Enums.SubscriptionStatus
    planName?: StringFilter<"Subscription"> | string
    startDate?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    orderId?: StringNullableFilter<"Subscription"> | string | null
    transactionId?: StringNullableFilter<"Subscription"> | string | null
    grossAmount?: IntNullableFilter<"Subscription"> | number | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    transactions?: TransactionListRelationFilter
  }

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    planName?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    orderId?: SortOrderInput | SortOrder
    transactionId?: SortOrderInput | SortOrder
    grossAmount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    transactions?: TransactionOrderByRelationAggregateInput
  }

  export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    orderId?: string
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    status?: EnumSubscriptionStatusFilter<"Subscription"> | $Enums.SubscriptionStatus
    planName?: StringFilter<"Subscription"> | string
    startDate?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    transactionId?: StringNullableFilter<"Subscription"> | string | null
    grossAmount?: IntNullableFilter<"Subscription"> | number | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    transactions?: TransactionListRelationFilter
  }, "id" | "userId" | "orderId">

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    planName?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    orderId?: SortOrderInput | SortOrder
    transactionId?: SortOrderInput | SortOrder
    grossAmount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _avg?: SubscriptionAvgOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
    _sum?: SubscriptionSumOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    OR?: SubscriptionScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subscription"> | string
    userId?: StringWithAggregatesFilter<"Subscription"> | string
    status?: EnumSubscriptionStatusWithAggregatesFilter<"Subscription"> | $Enums.SubscriptionStatus
    planName?: StringWithAggregatesFilter<"Subscription"> | string
    startDate?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    orderId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    transactionId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    grossAmount?: IntNullableWithAggregatesFilter<"Subscription"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: StringFilter<"Transaction"> | string
    subscriptionId?: StringFilter<"Transaction"> | string
    orderId?: StringFilter<"Transaction"> | string
    transactionStatus?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus
    grossAmount?: IntFilter<"Transaction"> | number
    paymentType?: StringNullableFilter<"Transaction"> | string | null
    transactionTime?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    settlementTime?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    webhookPayload?: JsonNullableFilter<"Transaction">
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
    subscription?: XOR<SubscriptionRelationFilter, SubscriptionWhereInput>
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    subscriptionId?: SortOrder
    orderId?: SortOrder
    transactionStatus?: SortOrder
    grossAmount?: SortOrder
    paymentType?: SortOrderInput | SortOrder
    transactionTime?: SortOrderInput | SortOrder
    settlementTime?: SortOrderInput | SortOrder
    webhookPayload?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    subscription?: SubscriptionOrderByWithRelationInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    orderId?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    subscriptionId?: StringFilter<"Transaction"> | string
    transactionStatus?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus
    grossAmount?: IntFilter<"Transaction"> | number
    paymentType?: StringNullableFilter<"Transaction"> | string | null
    transactionTime?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    settlementTime?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    webhookPayload?: JsonNullableFilter<"Transaction">
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
    subscription?: XOR<SubscriptionRelationFilter, SubscriptionWhereInput>
  }, "id" | "orderId">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    subscriptionId?: SortOrder
    orderId?: SortOrder
    transactionStatus?: SortOrder
    grossAmount?: SortOrder
    paymentType?: SortOrderInput | SortOrder
    transactionTime?: SortOrderInput | SortOrder
    settlementTime?: SortOrderInput | SortOrder
    webhookPayload?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transaction"> | string
    subscriptionId?: StringWithAggregatesFilter<"Transaction"> | string
    orderId?: StringWithAggregatesFilter<"Transaction"> | string
    transactionStatus?: EnumTransactionStatusWithAggregatesFilter<"Transaction"> | $Enums.TransactionStatus
    grossAmount?: IntWithAggregatesFilter<"Transaction"> | number
    paymentType?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    transactionTime?: DateTimeNullableWithAggregatesFilter<"Transaction"> | Date | string | null
    settlementTime?: DateTimeNullableWithAggregatesFilter<"Transaction"> | Date | string | null
    webhookPayload?: JsonNullableWithAggregatesFilter<"Transaction">
    createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
  }

  export type EbookWhereInput = {
    AND?: EbookWhereInput | EbookWhereInput[]
    OR?: EbookWhereInput[]
    NOT?: EbookWhereInput | EbookWhereInput[]
    id?: StringFilter<"Ebook"> | string
    title?: StringFilter<"Ebook"> | string
    author?: StringFilter<"Ebook"> | string
    description?: StringNullableFilter<"Ebook"> | string | null
    coverUrl?: StringNullableFilter<"Ebook"> | string | null
    pdfUrl?: StringNullableFilter<"Ebook"> | string | null
    publicId?: StringNullableFilter<"Ebook"> | string | null
    category?: StringFilter<"Ebook"> | string
    categoryId?: IntNullableFilter<"Ebook"> | number | null
    isPremium?: BoolFilter<"Ebook"> | boolean
    isActive?: BoolFilter<"Ebook"> | boolean
    priority?: IntFilter<"Ebook"> | number
    createdAt?: DateTimeFilter<"Ebook"> | Date | string
    updatedAt?: DateTimeFilter<"Ebook"> | Date | string
    readingLogs?: ReadingLogListRelationFilter
    readingProgress?: ReadingProgressListRelationFilter
    readlist?: ReadlistListRelationFilter
    annotations?: AnnotationListRelationFilter
    categoryRel?: XOR<CategoryNullableRelationFilter, CategoryWhereInput> | null
  }

  export type EbookOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    author?: SortOrder
    description?: SortOrderInput | SortOrder
    coverUrl?: SortOrderInput | SortOrder
    pdfUrl?: SortOrderInput | SortOrder
    publicId?: SortOrderInput | SortOrder
    category?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    isPremium?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    readingLogs?: ReadingLogOrderByRelationAggregateInput
    readingProgress?: ReadingProgressOrderByRelationAggregateInput
    readlist?: ReadlistOrderByRelationAggregateInput
    annotations?: AnnotationOrderByRelationAggregateInput
    categoryRel?: CategoryOrderByWithRelationInput
  }

  export type EbookWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EbookWhereInput | EbookWhereInput[]
    OR?: EbookWhereInput[]
    NOT?: EbookWhereInput | EbookWhereInput[]
    title?: StringFilter<"Ebook"> | string
    author?: StringFilter<"Ebook"> | string
    description?: StringNullableFilter<"Ebook"> | string | null
    coverUrl?: StringNullableFilter<"Ebook"> | string | null
    pdfUrl?: StringNullableFilter<"Ebook"> | string | null
    publicId?: StringNullableFilter<"Ebook"> | string | null
    category?: StringFilter<"Ebook"> | string
    categoryId?: IntNullableFilter<"Ebook"> | number | null
    isPremium?: BoolFilter<"Ebook"> | boolean
    isActive?: BoolFilter<"Ebook"> | boolean
    priority?: IntFilter<"Ebook"> | number
    createdAt?: DateTimeFilter<"Ebook"> | Date | string
    updatedAt?: DateTimeFilter<"Ebook"> | Date | string
    readingLogs?: ReadingLogListRelationFilter
    readingProgress?: ReadingProgressListRelationFilter
    readlist?: ReadlistListRelationFilter
    annotations?: AnnotationListRelationFilter
    categoryRel?: XOR<CategoryNullableRelationFilter, CategoryWhereInput> | null
  }, "id">

  export type EbookOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    author?: SortOrder
    description?: SortOrderInput | SortOrder
    coverUrl?: SortOrderInput | SortOrder
    pdfUrl?: SortOrderInput | SortOrder
    publicId?: SortOrderInput | SortOrder
    category?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    isPremium?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EbookCountOrderByAggregateInput
    _avg?: EbookAvgOrderByAggregateInput
    _max?: EbookMaxOrderByAggregateInput
    _min?: EbookMinOrderByAggregateInput
    _sum?: EbookSumOrderByAggregateInput
  }

  export type EbookScalarWhereWithAggregatesInput = {
    AND?: EbookScalarWhereWithAggregatesInput | EbookScalarWhereWithAggregatesInput[]
    OR?: EbookScalarWhereWithAggregatesInput[]
    NOT?: EbookScalarWhereWithAggregatesInput | EbookScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Ebook"> | string
    title?: StringWithAggregatesFilter<"Ebook"> | string
    author?: StringWithAggregatesFilter<"Ebook"> | string
    description?: StringNullableWithAggregatesFilter<"Ebook"> | string | null
    coverUrl?: StringNullableWithAggregatesFilter<"Ebook"> | string | null
    pdfUrl?: StringNullableWithAggregatesFilter<"Ebook"> | string | null
    publicId?: StringNullableWithAggregatesFilter<"Ebook"> | string | null
    category?: StringWithAggregatesFilter<"Ebook"> | string
    categoryId?: IntNullableWithAggregatesFilter<"Ebook"> | number | null
    isPremium?: BoolWithAggregatesFilter<"Ebook"> | boolean
    isActive?: BoolWithAggregatesFilter<"Ebook"> | boolean
    priority?: IntWithAggregatesFilter<"Ebook"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Ebook"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Ebook"> | Date | string
  }

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: IntFilter<"Category"> | number
    name?: StringFilter<"Category"> | string
    slug?: StringFilter<"Category"> | string
    icon?: StringNullableFilter<"Category"> | string | null
    description?: StringNullableFilter<"Category"> | string | null
    displayOrder?: IntFilter<"Category"> | number
    isActive?: BoolFilter<"Category"> | boolean
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    ebooks?: EbookListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    icon?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    displayOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ebooks?: EbookOrderByRelationAggregateInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    slug?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    name?: StringFilter<"Category"> | string
    icon?: StringNullableFilter<"Category"> | string | null
    description?: StringNullableFilter<"Category"> | string | null
    displayOrder?: IntFilter<"Category"> | number
    isActive?: BoolFilter<"Category"> | boolean
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    ebooks?: EbookListRelationFilter
  }, "id" | "slug">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    icon?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    displayOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _avg?: CategoryAvgOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
    _sum?: CategorySumOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Category"> | number
    name?: StringWithAggregatesFilter<"Category"> | string
    slug?: StringWithAggregatesFilter<"Category"> | string
    icon?: StringNullableWithAggregatesFilter<"Category"> | string | null
    description?: StringNullableWithAggregatesFilter<"Category"> | string | null
    displayOrder?: IntWithAggregatesFilter<"Category"> | number
    isActive?: BoolWithAggregatesFilter<"Category"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
  }

  export type BannerWhereInput = {
    AND?: BannerWhereInput | BannerWhereInput[]
    OR?: BannerWhereInput[]
    NOT?: BannerWhereInput | BannerWhereInput[]
    id?: StringFilter<"Banner"> | string
    title?: StringFilter<"Banner"> | string
    subtitle?: StringNullableFilter<"Banner"> | string | null
    ctaLabel?: StringNullableFilter<"Banner"> | string | null
    ctaLink?: StringNullableFilter<"Banner"> | string | null
    imageUrl?: StringNullableFilter<"Banner"> | string | null
    isActive?: BoolFilter<"Banner"> | boolean
    priority?: IntFilter<"Banner"> | number
    createdAt?: DateTimeFilter<"Banner"> | Date | string
    updatedAt?: DateTimeFilter<"Banner"> | Date | string
  }

  export type BannerOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    subtitle?: SortOrderInput | SortOrder
    ctaLabel?: SortOrderInput | SortOrder
    ctaLink?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BannerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BannerWhereInput | BannerWhereInput[]
    OR?: BannerWhereInput[]
    NOT?: BannerWhereInput | BannerWhereInput[]
    title?: StringFilter<"Banner"> | string
    subtitle?: StringNullableFilter<"Banner"> | string | null
    ctaLabel?: StringNullableFilter<"Banner"> | string | null
    ctaLink?: StringNullableFilter<"Banner"> | string | null
    imageUrl?: StringNullableFilter<"Banner"> | string | null
    isActive?: BoolFilter<"Banner"> | boolean
    priority?: IntFilter<"Banner"> | number
    createdAt?: DateTimeFilter<"Banner"> | Date | string
    updatedAt?: DateTimeFilter<"Banner"> | Date | string
  }, "id">

  export type BannerOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    subtitle?: SortOrderInput | SortOrder
    ctaLabel?: SortOrderInput | SortOrder
    ctaLink?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BannerCountOrderByAggregateInput
    _avg?: BannerAvgOrderByAggregateInput
    _max?: BannerMaxOrderByAggregateInput
    _min?: BannerMinOrderByAggregateInput
    _sum?: BannerSumOrderByAggregateInput
  }

  export type BannerScalarWhereWithAggregatesInput = {
    AND?: BannerScalarWhereWithAggregatesInput | BannerScalarWhereWithAggregatesInput[]
    OR?: BannerScalarWhereWithAggregatesInput[]
    NOT?: BannerScalarWhereWithAggregatesInput | BannerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Banner"> | string
    title?: StringWithAggregatesFilter<"Banner"> | string
    subtitle?: StringNullableWithAggregatesFilter<"Banner"> | string | null
    ctaLabel?: StringNullableWithAggregatesFilter<"Banner"> | string | null
    ctaLink?: StringNullableWithAggregatesFilter<"Banner"> | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"Banner"> | string | null
    isActive?: BoolWithAggregatesFilter<"Banner"> | boolean
    priority?: IntWithAggregatesFilter<"Banner"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Banner"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Banner"> | Date | string
  }

  export type ReadingLogWhereInput = {
    AND?: ReadingLogWhereInput | ReadingLogWhereInput[]
    OR?: ReadingLogWhereInput[]
    NOT?: ReadingLogWhereInput | ReadingLogWhereInput[]
    id?: StringFilter<"ReadingLog"> | string
    userId?: StringFilter<"ReadingLog"> | string
    ebookId?: StringFilter<"ReadingLog"> | string
    startedAt?: DateTimeFilter<"ReadingLog"> | Date | string
    lastReadAt?: DateTimeFilter<"ReadingLog"> | Date | string
    ebook?: XOR<EbookRelationFilter, EbookWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type ReadingLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    startedAt?: SortOrder
    lastReadAt?: SortOrder
    ebook?: EbookOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type ReadingLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_ebookId?: ReadingLogUserIdEbookIdCompoundUniqueInput
    AND?: ReadingLogWhereInput | ReadingLogWhereInput[]
    OR?: ReadingLogWhereInput[]
    NOT?: ReadingLogWhereInput | ReadingLogWhereInput[]
    userId?: StringFilter<"ReadingLog"> | string
    ebookId?: StringFilter<"ReadingLog"> | string
    startedAt?: DateTimeFilter<"ReadingLog"> | Date | string
    lastReadAt?: DateTimeFilter<"ReadingLog"> | Date | string
    ebook?: XOR<EbookRelationFilter, EbookWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId_ebookId">

  export type ReadingLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    startedAt?: SortOrder
    lastReadAt?: SortOrder
    _count?: ReadingLogCountOrderByAggregateInput
    _max?: ReadingLogMaxOrderByAggregateInput
    _min?: ReadingLogMinOrderByAggregateInput
  }

  export type ReadingLogScalarWhereWithAggregatesInput = {
    AND?: ReadingLogScalarWhereWithAggregatesInput | ReadingLogScalarWhereWithAggregatesInput[]
    OR?: ReadingLogScalarWhereWithAggregatesInput[]
    NOT?: ReadingLogScalarWhereWithAggregatesInput | ReadingLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ReadingLog"> | string
    userId?: StringWithAggregatesFilter<"ReadingLog"> | string
    ebookId?: StringWithAggregatesFilter<"ReadingLog"> | string
    startedAt?: DateTimeWithAggregatesFilter<"ReadingLog"> | Date | string
    lastReadAt?: DateTimeWithAggregatesFilter<"ReadingLog"> | Date | string
  }

  export type AdminEventWhereInput = {
    AND?: AdminEventWhereInput | AdminEventWhereInput[]
    OR?: AdminEventWhereInput[]
    NOT?: AdminEventWhereInput | AdminEventWhereInput[]
    id?: StringFilter<"AdminEvent"> | string
    type?: StringFilter<"AdminEvent"> | string
    title?: StringFilter<"AdminEvent"> | string
    description?: StringNullableFilter<"AdminEvent"> | string | null
    metadata?: JsonNullableFilter<"AdminEvent">
    createdAt?: DateTimeFilter<"AdminEvent"> | Date | string
  }

  export type AdminEventOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AdminEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AdminEventWhereInput | AdminEventWhereInput[]
    OR?: AdminEventWhereInput[]
    NOT?: AdminEventWhereInput | AdminEventWhereInput[]
    type?: StringFilter<"AdminEvent"> | string
    title?: StringFilter<"AdminEvent"> | string
    description?: StringNullableFilter<"AdminEvent"> | string | null
    metadata?: JsonNullableFilter<"AdminEvent">
    createdAt?: DateTimeFilter<"AdminEvent"> | Date | string
  }, "id">

  export type AdminEventOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AdminEventCountOrderByAggregateInput
    _max?: AdminEventMaxOrderByAggregateInput
    _min?: AdminEventMinOrderByAggregateInput
  }

  export type AdminEventScalarWhereWithAggregatesInput = {
    AND?: AdminEventScalarWhereWithAggregatesInput | AdminEventScalarWhereWithAggregatesInput[]
    OR?: AdminEventScalarWhereWithAggregatesInput[]
    NOT?: AdminEventScalarWhereWithAggregatesInput | AdminEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AdminEvent"> | string
    type?: StringWithAggregatesFilter<"AdminEvent"> | string
    title?: StringWithAggregatesFilter<"AdminEvent"> | string
    description?: StringNullableWithAggregatesFilter<"AdminEvent"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"AdminEvent">
    createdAt?: DateTimeWithAggregatesFilter<"AdminEvent"> | Date | string
  }

  export type ReadingProgressWhereInput = {
    AND?: ReadingProgressWhereInput | ReadingProgressWhereInput[]
    OR?: ReadingProgressWhereInput[]
    NOT?: ReadingProgressWhereInput | ReadingProgressWhereInput[]
    id?: StringFilter<"ReadingProgress"> | string
    userId?: StringFilter<"ReadingProgress"> | string
    ebookId?: StringFilter<"ReadingProgress"> | string
    currentLocation?: StringNullableFilter<"ReadingProgress"> | string | null
    progress?: FloatFilter<"ReadingProgress"> | number
    createdAt?: DateTimeFilter<"ReadingProgress"> | Date | string
    updatedAt?: DateTimeFilter<"ReadingProgress"> | Date | string
    ebook?: XOR<EbookRelationFilter, EbookWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type ReadingProgressOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    currentLocation?: SortOrderInput | SortOrder
    progress?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ebook?: EbookOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type ReadingProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_ebookId?: ReadingProgressUserIdEbookIdCompoundUniqueInput
    AND?: ReadingProgressWhereInput | ReadingProgressWhereInput[]
    OR?: ReadingProgressWhereInput[]
    NOT?: ReadingProgressWhereInput | ReadingProgressWhereInput[]
    userId?: StringFilter<"ReadingProgress"> | string
    ebookId?: StringFilter<"ReadingProgress"> | string
    currentLocation?: StringNullableFilter<"ReadingProgress"> | string | null
    progress?: FloatFilter<"ReadingProgress"> | number
    createdAt?: DateTimeFilter<"ReadingProgress"> | Date | string
    updatedAt?: DateTimeFilter<"ReadingProgress"> | Date | string
    ebook?: XOR<EbookRelationFilter, EbookWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId_ebookId">

  export type ReadingProgressOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    currentLocation?: SortOrderInput | SortOrder
    progress?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReadingProgressCountOrderByAggregateInput
    _avg?: ReadingProgressAvgOrderByAggregateInput
    _max?: ReadingProgressMaxOrderByAggregateInput
    _min?: ReadingProgressMinOrderByAggregateInput
    _sum?: ReadingProgressSumOrderByAggregateInput
  }

  export type ReadingProgressScalarWhereWithAggregatesInput = {
    AND?: ReadingProgressScalarWhereWithAggregatesInput | ReadingProgressScalarWhereWithAggregatesInput[]
    OR?: ReadingProgressScalarWhereWithAggregatesInput[]
    NOT?: ReadingProgressScalarWhereWithAggregatesInput | ReadingProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ReadingProgress"> | string
    userId?: StringWithAggregatesFilter<"ReadingProgress"> | string
    ebookId?: StringWithAggregatesFilter<"ReadingProgress"> | string
    currentLocation?: StringNullableWithAggregatesFilter<"ReadingProgress"> | string | null
    progress?: FloatWithAggregatesFilter<"ReadingProgress"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ReadingProgress"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ReadingProgress"> | Date | string
  }

  export type AnnotationWhereInput = {
    AND?: AnnotationWhereInput | AnnotationWhereInput[]
    OR?: AnnotationWhereInput[]
    NOT?: AnnotationWhereInput | AnnotationWhereInput[]
    id?: StringFilter<"Annotation"> | string
    userId?: StringFilter<"Annotation"> | string
    ebookId?: StringFilter<"Annotation"> | string
    cfiRange?: StringFilter<"Annotation"> | string
    text?: StringFilter<"Annotation"> | string
    type?: StringFilter<"Annotation"> | string
    color?: StringNullableFilter<"Annotation"> | string | null
    createdAt?: DateTimeFilter<"Annotation"> | Date | string
    updatedAt?: DateTimeFilter<"Annotation"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    ebook?: XOR<EbookRelationFilter, EbookWhereInput>
  }

  export type AnnotationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    cfiRange?: SortOrder
    text?: SortOrder
    type?: SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    ebook?: EbookOrderByWithRelationInput
  }

  export type AnnotationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AnnotationWhereInput | AnnotationWhereInput[]
    OR?: AnnotationWhereInput[]
    NOT?: AnnotationWhereInput | AnnotationWhereInput[]
    userId?: StringFilter<"Annotation"> | string
    ebookId?: StringFilter<"Annotation"> | string
    cfiRange?: StringFilter<"Annotation"> | string
    text?: StringFilter<"Annotation"> | string
    type?: StringFilter<"Annotation"> | string
    color?: StringNullableFilter<"Annotation"> | string | null
    createdAt?: DateTimeFilter<"Annotation"> | Date | string
    updatedAt?: DateTimeFilter<"Annotation"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    ebook?: XOR<EbookRelationFilter, EbookWhereInput>
  }, "id">

  export type AnnotationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    cfiRange?: SortOrder
    text?: SortOrder
    type?: SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AnnotationCountOrderByAggregateInput
    _max?: AnnotationMaxOrderByAggregateInput
    _min?: AnnotationMinOrderByAggregateInput
  }

  export type AnnotationScalarWhereWithAggregatesInput = {
    AND?: AnnotationScalarWhereWithAggregatesInput | AnnotationScalarWhereWithAggregatesInput[]
    OR?: AnnotationScalarWhereWithAggregatesInput[]
    NOT?: AnnotationScalarWhereWithAggregatesInput | AnnotationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Annotation"> | string
    userId?: StringWithAggregatesFilter<"Annotation"> | string
    ebookId?: StringWithAggregatesFilter<"Annotation"> | string
    cfiRange?: StringWithAggregatesFilter<"Annotation"> | string
    text?: StringWithAggregatesFilter<"Annotation"> | string
    type?: StringWithAggregatesFilter<"Annotation"> | string
    color?: StringNullableWithAggregatesFilter<"Annotation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Annotation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Annotation"> | Date | string
  }

  export type ReadlistWhereInput = {
    AND?: ReadlistWhereInput | ReadlistWhereInput[]
    OR?: ReadlistWhereInput[]
    NOT?: ReadlistWhereInput | ReadlistWhereInput[]
    id?: StringFilter<"Readlist"> | string
    userId?: StringFilter<"Readlist"> | string
    ebookId?: StringFilter<"Readlist"> | string
    status?: EnumReadlistStatusFilter<"Readlist"> | $Enums.ReadlistStatus
    createdAt?: DateTimeFilter<"Readlist"> | Date | string
    updatedAt?: DateTimeFilter<"Readlist"> | Date | string
    ebook?: XOR<EbookRelationFilter, EbookWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type ReadlistOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ebook?: EbookOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type ReadlistWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_ebookId?: ReadlistUserIdEbookIdCompoundUniqueInput
    AND?: ReadlistWhereInput | ReadlistWhereInput[]
    OR?: ReadlistWhereInput[]
    NOT?: ReadlistWhereInput | ReadlistWhereInput[]
    userId?: StringFilter<"Readlist"> | string
    ebookId?: StringFilter<"Readlist"> | string
    status?: EnumReadlistStatusFilter<"Readlist"> | $Enums.ReadlistStatus
    createdAt?: DateTimeFilter<"Readlist"> | Date | string
    updatedAt?: DateTimeFilter<"Readlist"> | Date | string
    ebook?: XOR<EbookRelationFilter, EbookWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId_ebookId">

  export type ReadlistOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReadlistCountOrderByAggregateInput
    _max?: ReadlistMaxOrderByAggregateInput
    _min?: ReadlistMinOrderByAggregateInput
  }

  export type ReadlistScalarWhereWithAggregatesInput = {
    AND?: ReadlistScalarWhereWithAggregatesInput | ReadlistScalarWhereWithAggregatesInput[]
    OR?: ReadlistScalarWhereWithAggregatesInput[]
    NOT?: ReadlistScalarWhereWithAggregatesInput | ReadlistScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Readlist"> | string
    userId?: StringWithAggregatesFilter<"Readlist"> | string
    ebookId?: StringWithAggregatesFilter<"Readlist"> | string
    status?: EnumReadlistStatusWithAggregatesFilter<"Readlist"> | $Enums.ReadlistStatus
    createdAt?: DateTimeWithAggregatesFilter<"Readlist"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Readlist"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    firebaseUid: string
    email: string
    name?: string | null
    photoUrl?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogCreateNestedManyWithoutUserInput
    readingProgress?: ReadingProgressCreateNestedManyWithoutUserInput
    readlist?: ReadlistCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
    annotations?: AnnotationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    firebaseUid: string
    email: string
    name?: string | null
    photoUrl?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogUncheckedCreateNestedManyWithoutUserInput
    readingProgress?: ReadingProgressUncheckedCreateNestedManyWithoutUserInput
    readlist?: ReadlistUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
    annotations?: AnnotationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUpdateManyWithoutUserNestedInput
    readingProgress?: ReadingProgressUpdateManyWithoutUserNestedInput
    readlist?: ReadlistUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
    annotations?: AnnotationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUncheckedUpdateManyWithoutUserNestedInput
    readingProgress?: ReadingProgressUncheckedUpdateManyWithoutUserNestedInput
    readlist?: ReadlistUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
    annotations?: AnnotationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    firebaseUid: string
    email: string
    name?: string | null
    photoUrl?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    planName: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    orderId?: string | null
    transactionId?: string | null
    grossAmount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSubscriptionInput
    transactions?: TransactionCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateInput = {
    id?: string
    userId: string
    status?: $Enums.SubscriptionStatus
    planName: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    orderId?: string | null
    transactionId?: string | null
    grossAmount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    planName?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    grossAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSubscriptionNestedInput
    transactions?: TransactionUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    planName?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    grossAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionCreateManyInput = {
    id?: string
    userId: string
    status?: $Enums.SubscriptionStatus
    planName: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    orderId?: string | null
    transactionId?: string | null
    grossAmount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    planName?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    grossAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    planName?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    grossAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateInput = {
    id?: string
    orderId: string
    transactionStatus: $Enums.TransactionStatus
    grossAmount: number
    paymentType?: string | null
    transactionTime?: Date | string | null
    settlementTime?: Date | string | null
    webhookPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    subscription: SubscriptionCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: string
    subscriptionId: string
    orderId: string
    transactionStatus: $Enums.TransactionStatus
    grossAmount: number
    paymentType?: string | null
    transactionTime?: Date | string | null
    settlementTime?: Date | string | null
    webhookPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    transactionStatus?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    grossAmount?: IntFieldUpdateOperationsInput | number
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settlementTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    webhookPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription?: SubscriptionUpdateOneRequiredWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    subscriptionId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    transactionStatus?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    grossAmount?: IntFieldUpdateOperationsInput | number
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settlementTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    webhookPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManyInput = {
    id?: string
    subscriptionId: string
    orderId: string
    transactionStatus: $Enums.TransactionStatus
    grossAmount: number
    paymentType?: string | null
    transactionTime?: Date | string | null
    settlementTime?: Date | string | null
    webhookPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    transactionStatus?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    grossAmount?: IntFieldUpdateOperationsInput | number
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settlementTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    webhookPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    subscriptionId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    transactionStatus?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    grossAmount?: IntFieldUpdateOperationsInput | number
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settlementTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    webhookPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EbookCreateInput = {
    id?: string
    title: string
    author: string
    description?: string | null
    coverUrl?: string | null
    pdfUrl?: string | null
    publicId?: string | null
    category: string
    isPremium?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogCreateNestedManyWithoutEbookInput
    readingProgress?: ReadingProgressCreateNestedManyWithoutEbookInput
    readlist?: ReadlistCreateNestedManyWithoutEbookInput
    annotations?: AnnotationCreateNestedManyWithoutEbookInput
    categoryRel?: CategoryCreateNestedOneWithoutEbooksInput
  }

  export type EbookUncheckedCreateInput = {
    id?: string
    title: string
    author: string
    description?: string | null
    coverUrl?: string | null
    pdfUrl?: string | null
    publicId?: string | null
    category: string
    categoryId?: number | null
    isPremium?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogUncheckedCreateNestedManyWithoutEbookInput
    readingProgress?: ReadingProgressUncheckedCreateNestedManyWithoutEbookInput
    readlist?: ReadlistUncheckedCreateNestedManyWithoutEbookInput
    annotations?: AnnotationUncheckedCreateNestedManyWithoutEbookInput
  }

  export type EbookUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUpdateManyWithoutEbookNestedInput
    readingProgress?: ReadingProgressUpdateManyWithoutEbookNestedInput
    readlist?: ReadlistUpdateManyWithoutEbookNestedInput
    annotations?: AnnotationUpdateManyWithoutEbookNestedInput
    categoryRel?: CategoryUpdateOneWithoutEbooksNestedInput
  }

  export type EbookUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUncheckedUpdateManyWithoutEbookNestedInput
    readingProgress?: ReadingProgressUncheckedUpdateManyWithoutEbookNestedInput
    readlist?: ReadlistUncheckedUpdateManyWithoutEbookNestedInput
    annotations?: AnnotationUncheckedUpdateManyWithoutEbookNestedInput
  }

  export type EbookCreateManyInput = {
    id?: string
    title: string
    author: string
    description?: string | null
    coverUrl?: string | null
    pdfUrl?: string | null
    publicId?: string | null
    category: string
    categoryId?: number | null
    isPremium?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EbookUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EbookUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryCreateInput = {
    name: string
    slug: string
    icon?: string | null
    description?: string | null
    displayOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    ebooks?: EbookCreateNestedManyWithoutCategoryRelInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: number
    name: string
    slug: string
    icon?: string | null
    description?: string | null
    displayOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    ebooks?: EbookUncheckedCreateNestedManyWithoutCategoryRelInput
  }

  export type CategoryUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    displayOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ebooks?: EbookUpdateManyWithoutCategoryRelNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    displayOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ebooks?: EbookUncheckedUpdateManyWithoutCategoryRelNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: number
    name: string
    slug: string
    icon?: string | null
    description?: string | null
    displayOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    displayOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    displayOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BannerCreateInput = {
    id?: string
    title: string
    subtitle?: string | null
    ctaLabel?: string | null
    ctaLink?: string | null
    imageUrl?: string | null
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BannerUncheckedCreateInput = {
    id?: string
    title: string
    subtitle?: string | null
    ctaLabel?: string | null
    ctaLink?: string | null
    imageUrl?: string | null
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BannerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subtitle?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLabel?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLink?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BannerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subtitle?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLabel?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLink?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BannerCreateManyInput = {
    id?: string
    title: string
    subtitle?: string | null
    ctaLabel?: string | null
    ctaLink?: string | null
    imageUrl?: string | null
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BannerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subtitle?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLabel?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLink?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BannerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subtitle?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLabel?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLink?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingLogCreateInput = {
    id?: string
    startedAt?: Date | string
    lastReadAt?: Date | string
    ebook: EbookCreateNestedOneWithoutReadingLogsInput
    user: UserCreateNestedOneWithoutReadingLogsInput
  }

  export type ReadingLogUncheckedCreateInput = {
    id?: string
    userId: string
    ebookId: string
    startedAt?: Date | string
    lastReadAt?: Date | string
  }

  export type ReadingLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ebook?: EbookUpdateOneRequiredWithoutReadingLogsNestedInput
    user?: UserUpdateOneRequiredWithoutReadingLogsNestedInput
  }

  export type ReadingLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingLogCreateManyInput = {
    id?: string
    userId: string
    ebookId: string
    startedAt?: Date | string
    lastReadAt?: Date | string
  }

  export type ReadingLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminEventCreateInput = {
    id?: string
    type: string
    title: string
    description?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AdminEventUncheckedCreateInput = {
    id?: string
    type: string
    title: string
    description?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AdminEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminEventCreateManyInput = {
    id?: string
    type: string
    title: string
    description?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AdminEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingProgressCreateInput = {
    id?: string
    currentLocation?: string | null
    progress?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ebook: EbookCreateNestedOneWithoutReadingProgressInput
    user: UserCreateNestedOneWithoutReadingProgressInput
  }

  export type ReadingProgressUncheckedCreateInput = {
    id?: string
    userId: string
    ebookId: string
    currentLocation?: string | null
    progress?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReadingProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentLocation?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ebook?: EbookUpdateOneRequiredWithoutReadingProgressNestedInput
    user?: UserUpdateOneRequiredWithoutReadingProgressNestedInput
  }

  export type ReadingProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    currentLocation?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingProgressCreateManyInput = {
    id?: string
    userId: string
    ebookId: string
    currentLocation?: string | null
    progress?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReadingProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentLocation?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    currentLocation?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnotationCreateInput = {
    id?: string
    cfiRange: string
    text: string
    type: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAnnotationsInput
    ebook: EbookCreateNestedOneWithoutAnnotationsInput
  }

  export type AnnotationUncheckedCreateInput = {
    id?: string
    userId: string
    ebookId: string
    cfiRange: string
    text: string
    type: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnnotationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cfiRange?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAnnotationsNestedInput
    ebook?: EbookUpdateOneRequiredWithoutAnnotationsNestedInput
  }

  export type AnnotationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    cfiRange?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnotationCreateManyInput = {
    id?: string
    userId: string
    ebookId: string
    cfiRange: string
    text: string
    type: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnnotationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cfiRange?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnotationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    cfiRange?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadlistCreateInput = {
    id?: string
    status?: $Enums.ReadlistStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    ebook: EbookCreateNestedOneWithoutReadlistInput
    user: UserCreateNestedOneWithoutReadlistInput
  }

  export type ReadlistUncheckedCreateInput = {
    id?: string
    userId: string
    ebookId: string
    status?: $Enums.ReadlistStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReadlistUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumReadlistStatusFieldUpdateOperationsInput | $Enums.ReadlistStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ebook?: EbookUpdateOneRequiredWithoutReadlistNestedInput
    user?: UserUpdateOneRequiredWithoutReadlistNestedInput
  }

  export type ReadlistUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    status?: EnumReadlistStatusFieldUpdateOperationsInput | $Enums.ReadlistStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadlistCreateManyInput = {
    id?: string
    userId: string
    ebookId: string
    status?: $Enums.ReadlistStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReadlistUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumReadlistStatusFieldUpdateOperationsInput | $Enums.ReadlistStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadlistUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    status?: EnumReadlistStatusFieldUpdateOperationsInput | $Enums.ReadlistStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ReadingLogListRelationFilter = {
    every?: ReadingLogWhereInput
    some?: ReadingLogWhereInput
    none?: ReadingLogWhereInput
  }

  export type ReadingProgressListRelationFilter = {
    every?: ReadingProgressWhereInput
    some?: ReadingProgressWhereInput
    none?: ReadingProgressWhereInput
  }

  export type ReadlistListRelationFilter = {
    every?: ReadlistWhereInput
    some?: ReadlistWhereInput
    none?: ReadlistWhereInput
  }

  export type SubscriptionNullableRelationFilter = {
    is?: SubscriptionWhereInput | null
    isNot?: SubscriptionWhereInput | null
  }

  export type AnnotationListRelationFilter = {
    every?: AnnotationWhereInput
    some?: AnnotationWhereInput
    none?: AnnotationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ReadingLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReadingProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReadlistOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnnotationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    email?: SortOrder
    name?: SortOrder
    photoUrl?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    email?: SortOrder
    name?: SortOrder
    photoUrl?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    email?: SortOrder
    name?: SortOrder
    photoUrl?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    planName?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    orderId?: SortOrder
    transactionId?: SortOrder
    grossAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionAvgOrderByAggregateInput = {
    grossAmount?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    planName?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    orderId?: SortOrder
    transactionId?: SortOrder
    grossAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    planName?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    orderId?: SortOrder
    transactionId?: SortOrder
    grossAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionSumOrderByAggregateInput = {
    grossAmount?: SortOrder
  }

  export type EnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumTransactionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SubscriptionRelationFilter = {
    is?: SubscriptionWhereInput
    isNot?: SubscriptionWhereInput
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    subscriptionId?: SortOrder
    orderId?: SortOrder
    transactionStatus?: SortOrder
    grossAmount?: SortOrder
    paymentType?: SortOrder
    transactionTime?: SortOrder
    settlementTime?: SortOrder
    webhookPayload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    grossAmount?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    subscriptionId?: SortOrder
    orderId?: SortOrder
    transactionStatus?: SortOrder
    grossAmount?: SortOrder
    paymentType?: SortOrder
    transactionTime?: SortOrder
    settlementTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    subscriptionId?: SortOrder
    orderId?: SortOrder
    transactionStatus?: SortOrder
    grossAmount?: SortOrder
    paymentType?: SortOrder
    transactionTime?: SortOrder
    settlementTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    grossAmount?: SortOrder
  }

  export type EnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionStatusFilter<$PrismaModel>
    _max?: NestedEnumTransactionStatusFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CategoryNullableRelationFilter = {
    is?: CategoryWhereInput | null
    isNot?: CategoryWhereInput | null
  }

  export type EbookCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    author?: SortOrder
    description?: SortOrder
    coverUrl?: SortOrder
    pdfUrl?: SortOrder
    publicId?: SortOrder
    category?: SortOrder
    categoryId?: SortOrder
    isPremium?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EbookAvgOrderByAggregateInput = {
    categoryId?: SortOrder
    priority?: SortOrder
  }

  export type EbookMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    author?: SortOrder
    description?: SortOrder
    coverUrl?: SortOrder
    pdfUrl?: SortOrder
    publicId?: SortOrder
    category?: SortOrder
    categoryId?: SortOrder
    isPremium?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EbookMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    author?: SortOrder
    description?: SortOrder
    coverUrl?: SortOrder
    pdfUrl?: SortOrder
    publicId?: SortOrder
    category?: SortOrder
    categoryId?: SortOrder
    isPremium?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EbookSumOrderByAggregateInput = {
    categoryId?: SortOrder
    priority?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EbookListRelationFilter = {
    every?: EbookWhereInput
    some?: EbookWhereInput
    none?: EbookWhereInput
  }

  export type EbookOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    displayOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryAvgOrderByAggregateInput = {
    id?: SortOrder
    displayOrder?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    displayOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    displayOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategorySumOrderByAggregateInput = {
    id?: SortOrder
    displayOrder?: SortOrder
  }

  export type BannerCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    subtitle?: SortOrder
    ctaLabel?: SortOrder
    ctaLink?: SortOrder
    imageUrl?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BannerAvgOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type BannerMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    subtitle?: SortOrder
    ctaLabel?: SortOrder
    ctaLink?: SortOrder
    imageUrl?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BannerMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    subtitle?: SortOrder
    ctaLabel?: SortOrder
    ctaLink?: SortOrder
    imageUrl?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BannerSumOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type EbookRelationFilter = {
    is?: EbookWhereInput
    isNot?: EbookWhereInput
  }

  export type ReadingLogUserIdEbookIdCompoundUniqueInput = {
    userId: string
    ebookId: string
  }

  export type ReadingLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    startedAt?: SortOrder
    lastReadAt?: SortOrder
  }

  export type ReadingLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    startedAt?: SortOrder
    lastReadAt?: SortOrder
  }

  export type ReadingLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    startedAt?: SortOrder
    lastReadAt?: SortOrder
  }

  export type AdminEventCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminEventMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminEventMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type ReadingProgressUserIdEbookIdCompoundUniqueInput = {
    userId: string
    ebookId: string
  }

  export type ReadingProgressCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    currentLocation?: SortOrder
    progress?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReadingProgressAvgOrderByAggregateInput = {
    progress?: SortOrder
  }

  export type ReadingProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    currentLocation?: SortOrder
    progress?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReadingProgressMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    currentLocation?: SortOrder
    progress?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReadingProgressSumOrderByAggregateInput = {
    progress?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type AnnotationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    cfiRange?: SortOrder
    text?: SortOrder
    type?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnnotationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    cfiRange?: SortOrder
    text?: SortOrder
    type?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnnotationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    cfiRange?: SortOrder
    text?: SortOrder
    type?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumReadlistStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReadlistStatus | EnumReadlistStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReadlistStatus[] | ListEnumReadlistStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReadlistStatus[] | ListEnumReadlistStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReadlistStatusFilter<$PrismaModel> | $Enums.ReadlistStatus
  }

  export type ReadlistUserIdEbookIdCompoundUniqueInput = {
    userId: string
    ebookId: string
  }

  export type ReadlistCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReadlistMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReadlistMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ebookId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumReadlistStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReadlistStatus | EnumReadlistStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReadlistStatus[] | ListEnumReadlistStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReadlistStatus[] | ListEnumReadlistStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReadlistStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReadlistStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReadlistStatusFilter<$PrismaModel>
    _max?: NestedEnumReadlistStatusFilter<$PrismaModel>
  }

  export type ReadingLogCreateNestedManyWithoutUserInput = {
    create?: XOR<ReadingLogCreateWithoutUserInput, ReadingLogUncheckedCreateWithoutUserInput> | ReadingLogCreateWithoutUserInput[] | ReadingLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingLogCreateOrConnectWithoutUserInput | ReadingLogCreateOrConnectWithoutUserInput[]
    createMany?: ReadingLogCreateManyUserInputEnvelope
    connect?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
  }

  export type ReadingProgressCreateNestedManyWithoutUserInput = {
    create?: XOR<ReadingProgressCreateWithoutUserInput, ReadingProgressUncheckedCreateWithoutUserInput> | ReadingProgressCreateWithoutUserInput[] | ReadingProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutUserInput | ReadingProgressCreateOrConnectWithoutUserInput[]
    createMany?: ReadingProgressCreateManyUserInputEnvelope
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
  }

  export type ReadlistCreateNestedManyWithoutUserInput = {
    create?: XOR<ReadlistCreateWithoutUserInput, ReadlistUncheckedCreateWithoutUserInput> | ReadlistCreateWithoutUserInput[] | ReadlistUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadlistCreateOrConnectWithoutUserInput | ReadlistCreateOrConnectWithoutUserInput[]
    createMany?: ReadlistCreateManyUserInputEnvelope
    connect?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
  }

  export type SubscriptionCreateNestedOneWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    connect?: SubscriptionWhereUniqueInput
  }

  export type AnnotationCreateNestedManyWithoutUserInput = {
    create?: XOR<AnnotationCreateWithoutUserInput, AnnotationUncheckedCreateWithoutUserInput> | AnnotationCreateWithoutUserInput[] | AnnotationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnnotationCreateOrConnectWithoutUserInput | AnnotationCreateOrConnectWithoutUserInput[]
    createMany?: AnnotationCreateManyUserInputEnvelope
    connect?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
  }

  export type ReadingLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ReadingLogCreateWithoutUserInput, ReadingLogUncheckedCreateWithoutUserInput> | ReadingLogCreateWithoutUserInput[] | ReadingLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingLogCreateOrConnectWithoutUserInput | ReadingLogCreateOrConnectWithoutUserInput[]
    createMany?: ReadingLogCreateManyUserInputEnvelope
    connect?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
  }

  export type ReadingProgressUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ReadingProgressCreateWithoutUserInput, ReadingProgressUncheckedCreateWithoutUserInput> | ReadingProgressCreateWithoutUserInput[] | ReadingProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutUserInput | ReadingProgressCreateOrConnectWithoutUserInput[]
    createMany?: ReadingProgressCreateManyUserInputEnvelope
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
  }

  export type ReadlistUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ReadlistCreateWithoutUserInput, ReadlistUncheckedCreateWithoutUserInput> | ReadlistCreateWithoutUserInput[] | ReadlistUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadlistCreateOrConnectWithoutUserInput | ReadlistCreateOrConnectWithoutUserInput[]
    createMany?: ReadlistCreateManyUserInputEnvelope
    connect?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
  }

  export type SubscriptionUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    connect?: SubscriptionWhereUniqueInput
  }

  export type AnnotationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AnnotationCreateWithoutUserInput, AnnotationUncheckedCreateWithoutUserInput> | AnnotationCreateWithoutUserInput[] | AnnotationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnnotationCreateOrConnectWithoutUserInput | AnnotationCreateOrConnectWithoutUserInput[]
    createMany?: AnnotationCreateManyUserInputEnvelope
    connect?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ReadingLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReadingLogCreateWithoutUserInput, ReadingLogUncheckedCreateWithoutUserInput> | ReadingLogCreateWithoutUserInput[] | ReadingLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingLogCreateOrConnectWithoutUserInput | ReadingLogCreateOrConnectWithoutUserInput[]
    upsert?: ReadingLogUpsertWithWhereUniqueWithoutUserInput | ReadingLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReadingLogCreateManyUserInputEnvelope
    set?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    disconnect?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    delete?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    connect?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    update?: ReadingLogUpdateWithWhereUniqueWithoutUserInput | ReadingLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReadingLogUpdateManyWithWhereWithoutUserInput | ReadingLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReadingLogScalarWhereInput | ReadingLogScalarWhereInput[]
  }

  export type ReadingProgressUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReadingProgressCreateWithoutUserInput, ReadingProgressUncheckedCreateWithoutUserInput> | ReadingProgressCreateWithoutUserInput[] | ReadingProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutUserInput | ReadingProgressCreateOrConnectWithoutUserInput[]
    upsert?: ReadingProgressUpsertWithWhereUniqueWithoutUserInput | ReadingProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReadingProgressCreateManyUserInputEnvelope
    set?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    disconnect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    delete?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    update?: ReadingProgressUpdateWithWhereUniqueWithoutUserInput | ReadingProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReadingProgressUpdateManyWithWhereWithoutUserInput | ReadingProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReadingProgressScalarWhereInput | ReadingProgressScalarWhereInput[]
  }

  export type ReadlistUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReadlistCreateWithoutUserInput, ReadlistUncheckedCreateWithoutUserInput> | ReadlistCreateWithoutUserInput[] | ReadlistUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadlistCreateOrConnectWithoutUserInput | ReadlistCreateOrConnectWithoutUserInput[]
    upsert?: ReadlistUpsertWithWhereUniqueWithoutUserInput | ReadlistUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReadlistCreateManyUserInputEnvelope
    set?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    disconnect?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    delete?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    connect?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    update?: ReadlistUpdateWithWhereUniqueWithoutUserInput | ReadlistUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReadlistUpdateManyWithWhereWithoutUserInput | ReadlistUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReadlistScalarWhereInput | ReadlistScalarWhereInput[]
  }

  export type SubscriptionUpdateOneWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    upsert?: SubscriptionUpsertWithoutUserInput
    disconnect?: SubscriptionWhereInput | boolean
    delete?: SubscriptionWhereInput | boolean
    connect?: SubscriptionWhereUniqueInput
    update?: XOR<XOR<SubscriptionUpdateToOneWithWhereWithoutUserInput, SubscriptionUpdateWithoutUserInput>, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type AnnotationUpdateManyWithoutUserNestedInput = {
    create?: XOR<AnnotationCreateWithoutUserInput, AnnotationUncheckedCreateWithoutUserInput> | AnnotationCreateWithoutUserInput[] | AnnotationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnnotationCreateOrConnectWithoutUserInput | AnnotationCreateOrConnectWithoutUserInput[]
    upsert?: AnnotationUpsertWithWhereUniqueWithoutUserInput | AnnotationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AnnotationCreateManyUserInputEnvelope
    set?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    disconnect?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    delete?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    connect?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    update?: AnnotationUpdateWithWhereUniqueWithoutUserInput | AnnotationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AnnotationUpdateManyWithWhereWithoutUserInput | AnnotationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AnnotationScalarWhereInput | AnnotationScalarWhereInput[]
  }

  export type ReadingLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReadingLogCreateWithoutUserInput, ReadingLogUncheckedCreateWithoutUserInput> | ReadingLogCreateWithoutUserInput[] | ReadingLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingLogCreateOrConnectWithoutUserInput | ReadingLogCreateOrConnectWithoutUserInput[]
    upsert?: ReadingLogUpsertWithWhereUniqueWithoutUserInput | ReadingLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReadingLogCreateManyUserInputEnvelope
    set?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    disconnect?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    delete?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    connect?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    update?: ReadingLogUpdateWithWhereUniqueWithoutUserInput | ReadingLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReadingLogUpdateManyWithWhereWithoutUserInput | ReadingLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReadingLogScalarWhereInput | ReadingLogScalarWhereInput[]
  }

  export type ReadingProgressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReadingProgressCreateWithoutUserInput, ReadingProgressUncheckedCreateWithoutUserInput> | ReadingProgressCreateWithoutUserInput[] | ReadingProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutUserInput | ReadingProgressCreateOrConnectWithoutUserInput[]
    upsert?: ReadingProgressUpsertWithWhereUniqueWithoutUserInput | ReadingProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReadingProgressCreateManyUserInputEnvelope
    set?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    disconnect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    delete?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    update?: ReadingProgressUpdateWithWhereUniqueWithoutUserInput | ReadingProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReadingProgressUpdateManyWithWhereWithoutUserInput | ReadingProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReadingProgressScalarWhereInput | ReadingProgressScalarWhereInput[]
  }

  export type ReadlistUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReadlistCreateWithoutUserInput, ReadlistUncheckedCreateWithoutUserInput> | ReadlistCreateWithoutUserInput[] | ReadlistUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadlistCreateOrConnectWithoutUserInput | ReadlistCreateOrConnectWithoutUserInput[]
    upsert?: ReadlistUpsertWithWhereUniqueWithoutUserInput | ReadlistUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReadlistCreateManyUserInputEnvelope
    set?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    disconnect?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    delete?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    connect?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    update?: ReadlistUpdateWithWhereUniqueWithoutUserInput | ReadlistUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReadlistUpdateManyWithWhereWithoutUserInput | ReadlistUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReadlistScalarWhereInput | ReadlistScalarWhereInput[]
  }

  export type SubscriptionUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    upsert?: SubscriptionUpsertWithoutUserInput
    disconnect?: SubscriptionWhereInput | boolean
    delete?: SubscriptionWhereInput | boolean
    connect?: SubscriptionWhereUniqueInput
    update?: XOR<XOR<SubscriptionUpdateToOneWithWhereWithoutUserInput, SubscriptionUpdateWithoutUserInput>, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type AnnotationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AnnotationCreateWithoutUserInput, AnnotationUncheckedCreateWithoutUserInput> | AnnotationCreateWithoutUserInput[] | AnnotationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnnotationCreateOrConnectWithoutUserInput | AnnotationCreateOrConnectWithoutUserInput[]
    upsert?: AnnotationUpsertWithWhereUniqueWithoutUserInput | AnnotationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AnnotationCreateManyUserInputEnvelope
    set?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    disconnect?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    delete?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    connect?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    update?: AnnotationUpdateWithWhereUniqueWithoutUserInput | AnnotationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AnnotationUpdateManyWithWhereWithoutUserInput | AnnotationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AnnotationScalarWhereInput | AnnotationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSubscriptionInput = {
    create?: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionInput
    connect?: UserWhereUniqueInput
  }

  export type TransactionCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<TransactionCreateWithoutSubscriptionInput, TransactionUncheckedCreateWithoutSubscriptionInput> | TransactionCreateWithoutSubscriptionInput[] | TransactionUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutSubscriptionInput | TransactionCreateOrConnectWithoutSubscriptionInput[]
    createMany?: TransactionCreateManySubscriptionInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<TransactionCreateWithoutSubscriptionInput, TransactionUncheckedCreateWithoutSubscriptionInput> | TransactionCreateWithoutSubscriptionInput[] | TransactionUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutSubscriptionInput | TransactionCreateOrConnectWithoutSubscriptionInput[]
    createMany?: TransactionCreateManySubscriptionInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type EnumSubscriptionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutSubscriptionNestedInput = {
    create?: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionInput
    upsert?: UserUpsertWithoutSubscriptionInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSubscriptionInput, UserUpdateWithoutSubscriptionInput>, UserUncheckedUpdateWithoutSubscriptionInput>
  }

  export type TransactionUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<TransactionCreateWithoutSubscriptionInput, TransactionUncheckedCreateWithoutSubscriptionInput> | TransactionCreateWithoutSubscriptionInput[] | TransactionUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutSubscriptionInput | TransactionCreateOrConnectWithoutSubscriptionInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutSubscriptionInput | TransactionUpsertWithWhereUniqueWithoutSubscriptionInput[]
    createMany?: TransactionCreateManySubscriptionInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutSubscriptionInput | TransactionUpdateWithWhereUniqueWithoutSubscriptionInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutSubscriptionInput | TransactionUpdateManyWithWhereWithoutSubscriptionInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<TransactionCreateWithoutSubscriptionInput, TransactionUncheckedCreateWithoutSubscriptionInput> | TransactionCreateWithoutSubscriptionInput[] | TransactionUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutSubscriptionInput | TransactionCreateOrConnectWithoutSubscriptionInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutSubscriptionInput | TransactionUpsertWithWhereUniqueWithoutSubscriptionInput[]
    createMany?: TransactionCreateManySubscriptionInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutSubscriptionInput | TransactionUpdateWithWhereUniqueWithoutSubscriptionInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutSubscriptionInput | TransactionUpdateManyWithWhereWithoutSubscriptionInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type SubscriptionCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<SubscriptionCreateWithoutTransactionsInput, SubscriptionUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTransactionsInput
    connect?: SubscriptionWhereUniqueInput
  }

  export type EnumTransactionStatusFieldUpdateOperationsInput = {
    set?: $Enums.TransactionStatus
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SubscriptionUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<SubscriptionCreateWithoutTransactionsInput, SubscriptionUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTransactionsInput
    upsert?: SubscriptionUpsertWithoutTransactionsInput
    connect?: SubscriptionWhereUniqueInput
    update?: XOR<XOR<SubscriptionUpdateToOneWithWhereWithoutTransactionsInput, SubscriptionUpdateWithoutTransactionsInput>, SubscriptionUncheckedUpdateWithoutTransactionsInput>
  }

  export type ReadingLogCreateNestedManyWithoutEbookInput = {
    create?: XOR<ReadingLogCreateWithoutEbookInput, ReadingLogUncheckedCreateWithoutEbookInput> | ReadingLogCreateWithoutEbookInput[] | ReadingLogUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: ReadingLogCreateOrConnectWithoutEbookInput | ReadingLogCreateOrConnectWithoutEbookInput[]
    createMany?: ReadingLogCreateManyEbookInputEnvelope
    connect?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
  }

  export type ReadingProgressCreateNestedManyWithoutEbookInput = {
    create?: XOR<ReadingProgressCreateWithoutEbookInput, ReadingProgressUncheckedCreateWithoutEbookInput> | ReadingProgressCreateWithoutEbookInput[] | ReadingProgressUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutEbookInput | ReadingProgressCreateOrConnectWithoutEbookInput[]
    createMany?: ReadingProgressCreateManyEbookInputEnvelope
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
  }

  export type ReadlistCreateNestedManyWithoutEbookInput = {
    create?: XOR<ReadlistCreateWithoutEbookInput, ReadlistUncheckedCreateWithoutEbookInput> | ReadlistCreateWithoutEbookInput[] | ReadlistUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: ReadlistCreateOrConnectWithoutEbookInput | ReadlistCreateOrConnectWithoutEbookInput[]
    createMany?: ReadlistCreateManyEbookInputEnvelope
    connect?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
  }

  export type AnnotationCreateNestedManyWithoutEbookInput = {
    create?: XOR<AnnotationCreateWithoutEbookInput, AnnotationUncheckedCreateWithoutEbookInput> | AnnotationCreateWithoutEbookInput[] | AnnotationUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: AnnotationCreateOrConnectWithoutEbookInput | AnnotationCreateOrConnectWithoutEbookInput[]
    createMany?: AnnotationCreateManyEbookInputEnvelope
    connect?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
  }

  export type CategoryCreateNestedOneWithoutEbooksInput = {
    create?: XOR<CategoryCreateWithoutEbooksInput, CategoryUncheckedCreateWithoutEbooksInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutEbooksInput
    connect?: CategoryWhereUniqueInput
  }

  export type ReadingLogUncheckedCreateNestedManyWithoutEbookInput = {
    create?: XOR<ReadingLogCreateWithoutEbookInput, ReadingLogUncheckedCreateWithoutEbookInput> | ReadingLogCreateWithoutEbookInput[] | ReadingLogUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: ReadingLogCreateOrConnectWithoutEbookInput | ReadingLogCreateOrConnectWithoutEbookInput[]
    createMany?: ReadingLogCreateManyEbookInputEnvelope
    connect?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
  }

  export type ReadingProgressUncheckedCreateNestedManyWithoutEbookInput = {
    create?: XOR<ReadingProgressCreateWithoutEbookInput, ReadingProgressUncheckedCreateWithoutEbookInput> | ReadingProgressCreateWithoutEbookInput[] | ReadingProgressUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutEbookInput | ReadingProgressCreateOrConnectWithoutEbookInput[]
    createMany?: ReadingProgressCreateManyEbookInputEnvelope
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
  }

  export type ReadlistUncheckedCreateNestedManyWithoutEbookInput = {
    create?: XOR<ReadlistCreateWithoutEbookInput, ReadlistUncheckedCreateWithoutEbookInput> | ReadlistCreateWithoutEbookInput[] | ReadlistUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: ReadlistCreateOrConnectWithoutEbookInput | ReadlistCreateOrConnectWithoutEbookInput[]
    createMany?: ReadlistCreateManyEbookInputEnvelope
    connect?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
  }

  export type AnnotationUncheckedCreateNestedManyWithoutEbookInput = {
    create?: XOR<AnnotationCreateWithoutEbookInput, AnnotationUncheckedCreateWithoutEbookInput> | AnnotationCreateWithoutEbookInput[] | AnnotationUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: AnnotationCreateOrConnectWithoutEbookInput | AnnotationCreateOrConnectWithoutEbookInput[]
    createMany?: AnnotationCreateManyEbookInputEnvelope
    connect?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ReadingLogUpdateManyWithoutEbookNestedInput = {
    create?: XOR<ReadingLogCreateWithoutEbookInput, ReadingLogUncheckedCreateWithoutEbookInput> | ReadingLogCreateWithoutEbookInput[] | ReadingLogUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: ReadingLogCreateOrConnectWithoutEbookInput | ReadingLogCreateOrConnectWithoutEbookInput[]
    upsert?: ReadingLogUpsertWithWhereUniqueWithoutEbookInput | ReadingLogUpsertWithWhereUniqueWithoutEbookInput[]
    createMany?: ReadingLogCreateManyEbookInputEnvelope
    set?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    disconnect?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    delete?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    connect?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    update?: ReadingLogUpdateWithWhereUniqueWithoutEbookInput | ReadingLogUpdateWithWhereUniqueWithoutEbookInput[]
    updateMany?: ReadingLogUpdateManyWithWhereWithoutEbookInput | ReadingLogUpdateManyWithWhereWithoutEbookInput[]
    deleteMany?: ReadingLogScalarWhereInput | ReadingLogScalarWhereInput[]
  }

  export type ReadingProgressUpdateManyWithoutEbookNestedInput = {
    create?: XOR<ReadingProgressCreateWithoutEbookInput, ReadingProgressUncheckedCreateWithoutEbookInput> | ReadingProgressCreateWithoutEbookInput[] | ReadingProgressUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutEbookInput | ReadingProgressCreateOrConnectWithoutEbookInput[]
    upsert?: ReadingProgressUpsertWithWhereUniqueWithoutEbookInput | ReadingProgressUpsertWithWhereUniqueWithoutEbookInput[]
    createMany?: ReadingProgressCreateManyEbookInputEnvelope
    set?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    disconnect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    delete?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    update?: ReadingProgressUpdateWithWhereUniqueWithoutEbookInput | ReadingProgressUpdateWithWhereUniqueWithoutEbookInput[]
    updateMany?: ReadingProgressUpdateManyWithWhereWithoutEbookInput | ReadingProgressUpdateManyWithWhereWithoutEbookInput[]
    deleteMany?: ReadingProgressScalarWhereInput | ReadingProgressScalarWhereInput[]
  }

  export type ReadlistUpdateManyWithoutEbookNestedInput = {
    create?: XOR<ReadlistCreateWithoutEbookInput, ReadlistUncheckedCreateWithoutEbookInput> | ReadlistCreateWithoutEbookInput[] | ReadlistUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: ReadlistCreateOrConnectWithoutEbookInput | ReadlistCreateOrConnectWithoutEbookInput[]
    upsert?: ReadlistUpsertWithWhereUniqueWithoutEbookInput | ReadlistUpsertWithWhereUniqueWithoutEbookInput[]
    createMany?: ReadlistCreateManyEbookInputEnvelope
    set?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    disconnect?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    delete?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    connect?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    update?: ReadlistUpdateWithWhereUniqueWithoutEbookInput | ReadlistUpdateWithWhereUniqueWithoutEbookInput[]
    updateMany?: ReadlistUpdateManyWithWhereWithoutEbookInput | ReadlistUpdateManyWithWhereWithoutEbookInput[]
    deleteMany?: ReadlistScalarWhereInput | ReadlistScalarWhereInput[]
  }

  export type AnnotationUpdateManyWithoutEbookNestedInput = {
    create?: XOR<AnnotationCreateWithoutEbookInput, AnnotationUncheckedCreateWithoutEbookInput> | AnnotationCreateWithoutEbookInput[] | AnnotationUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: AnnotationCreateOrConnectWithoutEbookInput | AnnotationCreateOrConnectWithoutEbookInput[]
    upsert?: AnnotationUpsertWithWhereUniqueWithoutEbookInput | AnnotationUpsertWithWhereUniqueWithoutEbookInput[]
    createMany?: AnnotationCreateManyEbookInputEnvelope
    set?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    disconnect?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    delete?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    connect?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    update?: AnnotationUpdateWithWhereUniqueWithoutEbookInput | AnnotationUpdateWithWhereUniqueWithoutEbookInput[]
    updateMany?: AnnotationUpdateManyWithWhereWithoutEbookInput | AnnotationUpdateManyWithWhereWithoutEbookInput[]
    deleteMany?: AnnotationScalarWhereInput | AnnotationScalarWhereInput[]
  }

  export type CategoryUpdateOneWithoutEbooksNestedInput = {
    create?: XOR<CategoryCreateWithoutEbooksInput, CategoryUncheckedCreateWithoutEbooksInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutEbooksInput
    upsert?: CategoryUpsertWithoutEbooksInput
    disconnect?: CategoryWhereInput | boolean
    delete?: CategoryWhereInput | boolean
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutEbooksInput, CategoryUpdateWithoutEbooksInput>, CategoryUncheckedUpdateWithoutEbooksInput>
  }

  export type ReadingLogUncheckedUpdateManyWithoutEbookNestedInput = {
    create?: XOR<ReadingLogCreateWithoutEbookInput, ReadingLogUncheckedCreateWithoutEbookInput> | ReadingLogCreateWithoutEbookInput[] | ReadingLogUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: ReadingLogCreateOrConnectWithoutEbookInput | ReadingLogCreateOrConnectWithoutEbookInput[]
    upsert?: ReadingLogUpsertWithWhereUniqueWithoutEbookInput | ReadingLogUpsertWithWhereUniqueWithoutEbookInput[]
    createMany?: ReadingLogCreateManyEbookInputEnvelope
    set?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    disconnect?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    delete?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    connect?: ReadingLogWhereUniqueInput | ReadingLogWhereUniqueInput[]
    update?: ReadingLogUpdateWithWhereUniqueWithoutEbookInput | ReadingLogUpdateWithWhereUniqueWithoutEbookInput[]
    updateMany?: ReadingLogUpdateManyWithWhereWithoutEbookInput | ReadingLogUpdateManyWithWhereWithoutEbookInput[]
    deleteMany?: ReadingLogScalarWhereInput | ReadingLogScalarWhereInput[]
  }

  export type ReadingProgressUncheckedUpdateManyWithoutEbookNestedInput = {
    create?: XOR<ReadingProgressCreateWithoutEbookInput, ReadingProgressUncheckedCreateWithoutEbookInput> | ReadingProgressCreateWithoutEbookInput[] | ReadingProgressUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutEbookInput | ReadingProgressCreateOrConnectWithoutEbookInput[]
    upsert?: ReadingProgressUpsertWithWhereUniqueWithoutEbookInput | ReadingProgressUpsertWithWhereUniqueWithoutEbookInput[]
    createMany?: ReadingProgressCreateManyEbookInputEnvelope
    set?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    disconnect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    delete?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    update?: ReadingProgressUpdateWithWhereUniqueWithoutEbookInput | ReadingProgressUpdateWithWhereUniqueWithoutEbookInput[]
    updateMany?: ReadingProgressUpdateManyWithWhereWithoutEbookInput | ReadingProgressUpdateManyWithWhereWithoutEbookInput[]
    deleteMany?: ReadingProgressScalarWhereInput | ReadingProgressScalarWhereInput[]
  }

  export type ReadlistUncheckedUpdateManyWithoutEbookNestedInput = {
    create?: XOR<ReadlistCreateWithoutEbookInput, ReadlistUncheckedCreateWithoutEbookInput> | ReadlistCreateWithoutEbookInput[] | ReadlistUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: ReadlistCreateOrConnectWithoutEbookInput | ReadlistCreateOrConnectWithoutEbookInput[]
    upsert?: ReadlistUpsertWithWhereUniqueWithoutEbookInput | ReadlistUpsertWithWhereUniqueWithoutEbookInput[]
    createMany?: ReadlistCreateManyEbookInputEnvelope
    set?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    disconnect?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    delete?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    connect?: ReadlistWhereUniqueInput | ReadlistWhereUniqueInput[]
    update?: ReadlistUpdateWithWhereUniqueWithoutEbookInput | ReadlistUpdateWithWhereUniqueWithoutEbookInput[]
    updateMany?: ReadlistUpdateManyWithWhereWithoutEbookInput | ReadlistUpdateManyWithWhereWithoutEbookInput[]
    deleteMany?: ReadlistScalarWhereInput | ReadlistScalarWhereInput[]
  }

  export type AnnotationUncheckedUpdateManyWithoutEbookNestedInput = {
    create?: XOR<AnnotationCreateWithoutEbookInput, AnnotationUncheckedCreateWithoutEbookInput> | AnnotationCreateWithoutEbookInput[] | AnnotationUncheckedCreateWithoutEbookInput[]
    connectOrCreate?: AnnotationCreateOrConnectWithoutEbookInput | AnnotationCreateOrConnectWithoutEbookInput[]
    upsert?: AnnotationUpsertWithWhereUniqueWithoutEbookInput | AnnotationUpsertWithWhereUniqueWithoutEbookInput[]
    createMany?: AnnotationCreateManyEbookInputEnvelope
    set?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    disconnect?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    delete?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    connect?: AnnotationWhereUniqueInput | AnnotationWhereUniqueInput[]
    update?: AnnotationUpdateWithWhereUniqueWithoutEbookInput | AnnotationUpdateWithWhereUniqueWithoutEbookInput[]
    updateMany?: AnnotationUpdateManyWithWhereWithoutEbookInput | AnnotationUpdateManyWithWhereWithoutEbookInput[]
    deleteMany?: AnnotationScalarWhereInput | AnnotationScalarWhereInput[]
  }

  export type EbookCreateNestedManyWithoutCategoryRelInput = {
    create?: XOR<EbookCreateWithoutCategoryRelInput, EbookUncheckedCreateWithoutCategoryRelInput> | EbookCreateWithoutCategoryRelInput[] | EbookUncheckedCreateWithoutCategoryRelInput[]
    connectOrCreate?: EbookCreateOrConnectWithoutCategoryRelInput | EbookCreateOrConnectWithoutCategoryRelInput[]
    createMany?: EbookCreateManyCategoryRelInputEnvelope
    connect?: EbookWhereUniqueInput | EbookWhereUniqueInput[]
  }

  export type EbookUncheckedCreateNestedManyWithoutCategoryRelInput = {
    create?: XOR<EbookCreateWithoutCategoryRelInput, EbookUncheckedCreateWithoutCategoryRelInput> | EbookCreateWithoutCategoryRelInput[] | EbookUncheckedCreateWithoutCategoryRelInput[]
    connectOrCreate?: EbookCreateOrConnectWithoutCategoryRelInput | EbookCreateOrConnectWithoutCategoryRelInput[]
    createMany?: EbookCreateManyCategoryRelInputEnvelope
    connect?: EbookWhereUniqueInput | EbookWhereUniqueInput[]
  }

  export type EbookUpdateManyWithoutCategoryRelNestedInput = {
    create?: XOR<EbookCreateWithoutCategoryRelInput, EbookUncheckedCreateWithoutCategoryRelInput> | EbookCreateWithoutCategoryRelInput[] | EbookUncheckedCreateWithoutCategoryRelInput[]
    connectOrCreate?: EbookCreateOrConnectWithoutCategoryRelInput | EbookCreateOrConnectWithoutCategoryRelInput[]
    upsert?: EbookUpsertWithWhereUniqueWithoutCategoryRelInput | EbookUpsertWithWhereUniqueWithoutCategoryRelInput[]
    createMany?: EbookCreateManyCategoryRelInputEnvelope
    set?: EbookWhereUniqueInput | EbookWhereUniqueInput[]
    disconnect?: EbookWhereUniqueInput | EbookWhereUniqueInput[]
    delete?: EbookWhereUniqueInput | EbookWhereUniqueInput[]
    connect?: EbookWhereUniqueInput | EbookWhereUniqueInput[]
    update?: EbookUpdateWithWhereUniqueWithoutCategoryRelInput | EbookUpdateWithWhereUniqueWithoutCategoryRelInput[]
    updateMany?: EbookUpdateManyWithWhereWithoutCategoryRelInput | EbookUpdateManyWithWhereWithoutCategoryRelInput[]
    deleteMany?: EbookScalarWhereInput | EbookScalarWhereInput[]
  }

  export type EbookUncheckedUpdateManyWithoutCategoryRelNestedInput = {
    create?: XOR<EbookCreateWithoutCategoryRelInput, EbookUncheckedCreateWithoutCategoryRelInput> | EbookCreateWithoutCategoryRelInput[] | EbookUncheckedCreateWithoutCategoryRelInput[]
    connectOrCreate?: EbookCreateOrConnectWithoutCategoryRelInput | EbookCreateOrConnectWithoutCategoryRelInput[]
    upsert?: EbookUpsertWithWhereUniqueWithoutCategoryRelInput | EbookUpsertWithWhereUniqueWithoutCategoryRelInput[]
    createMany?: EbookCreateManyCategoryRelInputEnvelope
    set?: EbookWhereUniqueInput | EbookWhereUniqueInput[]
    disconnect?: EbookWhereUniqueInput | EbookWhereUniqueInput[]
    delete?: EbookWhereUniqueInput | EbookWhereUniqueInput[]
    connect?: EbookWhereUniqueInput | EbookWhereUniqueInput[]
    update?: EbookUpdateWithWhereUniqueWithoutCategoryRelInput | EbookUpdateWithWhereUniqueWithoutCategoryRelInput[]
    updateMany?: EbookUpdateManyWithWhereWithoutCategoryRelInput | EbookUpdateManyWithWhereWithoutCategoryRelInput[]
    deleteMany?: EbookScalarWhereInput | EbookScalarWhereInput[]
  }

  export type EbookCreateNestedOneWithoutReadingLogsInput = {
    create?: XOR<EbookCreateWithoutReadingLogsInput, EbookUncheckedCreateWithoutReadingLogsInput>
    connectOrCreate?: EbookCreateOrConnectWithoutReadingLogsInput
    connect?: EbookWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReadingLogsInput = {
    create?: XOR<UserCreateWithoutReadingLogsInput, UserUncheckedCreateWithoutReadingLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReadingLogsInput
    connect?: UserWhereUniqueInput
  }

  export type EbookUpdateOneRequiredWithoutReadingLogsNestedInput = {
    create?: XOR<EbookCreateWithoutReadingLogsInput, EbookUncheckedCreateWithoutReadingLogsInput>
    connectOrCreate?: EbookCreateOrConnectWithoutReadingLogsInput
    upsert?: EbookUpsertWithoutReadingLogsInput
    connect?: EbookWhereUniqueInput
    update?: XOR<XOR<EbookUpdateToOneWithWhereWithoutReadingLogsInput, EbookUpdateWithoutReadingLogsInput>, EbookUncheckedUpdateWithoutReadingLogsInput>
  }

  export type UserUpdateOneRequiredWithoutReadingLogsNestedInput = {
    create?: XOR<UserCreateWithoutReadingLogsInput, UserUncheckedCreateWithoutReadingLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReadingLogsInput
    upsert?: UserUpsertWithoutReadingLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReadingLogsInput, UserUpdateWithoutReadingLogsInput>, UserUncheckedUpdateWithoutReadingLogsInput>
  }

  export type EbookCreateNestedOneWithoutReadingProgressInput = {
    create?: XOR<EbookCreateWithoutReadingProgressInput, EbookUncheckedCreateWithoutReadingProgressInput>
    connectOrCreate?: EbookCreateOrConnectWithoutReadingProgressInput
    connect?: EbookWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReadingProgressInput = {
    create?: XOR<UserCreateWithoutReadingProgressInput, UserUncheckedCreateWithoutReadingProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutReadingProgressInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EbookUpdateOneRequiredWithoutReadingProgressNestedInput = {
    create?: XOR<EbookCreateWithoutReadingProgressInput, EbookUncheckedCreateWithoutReadingProgressInput>
    connectOrCreate?: EbookCreateOrConnectWithoutReadingProgressInput
    upsert?: EbookUpsertWithoutReadingProgressInput
    connect?: EbookWhereUniqueInput
    update?: XOR<XOR<EbookUpdateToOneWithWhereWithoutReadingProgressInput, EbookUpdateWithoutReadingProgressInput>, EbookUncheckedUpdateWithoutReadingProgressInput>
  }

  export type UserUpdateOneRequiredWithoutReadingProgressNestedInput = {
    create?: XOR<UserCreateWithoutReadingProgressInput, UserUncheckedCreateWithoutReadingProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutReadingProgressInput
    upsert?: UserUpsertWithoutReadingProgressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReadingProgressInput, UserUpdateWithoutReadingProgressInput>, UserUncheckedUpdateWithoutReadingProgressInput>
  }

  export type UserCreateNestedOneWithoutAnnotationsInput = {
    create?: XOR<UserCreateWithoutAnnotationsInput, UserUncheckedCreateWithoutAnnotationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAnnotationsInput
    connect?: UserWhereUniqueInput
  }

  export type EbookCreateNestedOneWithoutAnnotationsInput = {
    create?: XOR<EbookCreateWithoutAnnotationsInput, EbookUncheckedCreateWithoutAnnotationsInput>
    connectOrCreate?: EbookCreateOrConnectWithoutAnnotationsInput
    connect?: EbookWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAnnotationsNestedInput = {
    create?: XOR<UserCreateWithoutAnnotationsInput, UserUncheckedCreateWithoutAnnotationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAnnotationsInput
    upsert?: UserUpsertWithoutAnnotationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAnnotationsInput, UserUpdateWithoutAnnotationsInput>, UserUncheckedUpdateWithoutAnnotationsInput>
  }

  export type EbookUpdateOneRequiredWithoutAnnotationsNestedInput = {
    create?: XOR<EbookCreateWithoutAnnotationsInput, EbookUncheckedCreateWithoutAnnotationsInput>
    connectOrCreate?: EbookCreateOrConnectWithoutAnnotationsInput
    upsert?: EbookUpsertWithoutAnnotationsInput
    connect?: EbookWhereUniqueInput
    update?: XOR<XOR<EbookUpdateToOneWithWhereWithoutAnnotationsInput, EbookUpdateWithoutAnnotationsInput>, EbookUncheckedUpdateWithoutAnnotationsInput>
  }

  export type EbookCreateNestedOneWithoutReadlistInput = {
    create?: XOR<EbookCreateWithoutReadlistInput, EbookUncheckedCreateWithoutReadlistInput>
    connectOrCreate?: EbookCreateOrConnectWithoutReadlistInput
    connect?: EbookWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReadlistInput = {
    create?: XOR<UserCreateWithoutReadlistInput, UserUncheckedCreateWithoutReadlistInput>
    connectOrCreate?: UserCreateOrConnectWithoutReadlistInput
    connect?: UserWhereUniqueInput
  }

  export type EnumReadlistStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReadlistStatus
  }

  export type EbookUpdateOneRequiredWithoutReadlistNestedInput = {
    create?: XOR<EbookCreateWithoutReadlistInput, EbookUncheckedCreateWithoutReadlistInput>
    connectOrCreate?: EbookCreateOrConnectWithoutReadlistInput
    upsert?: EbookUpsertWithoutReadlistInput
    connect?: EbookWhereUniqueInput
    update?: XOR<XOR<EbookUpdateToOneWithWhereWithoutReadlistInput, EbookUpdateWithoutReadlistInput>, EbookUncheckedUpdateWithoutReadlistInput>
  }

  export type UserUpdateOneRequiredWithoutReadlistNestedInput = {
    create?: XOR<UserCreateWithoutReadlistInput, UserUncheckedCreateWithoutReadlistInput>
    connectOrCreate?: UserCreateOrConnectWithoutReadlistInput
    upsert?: UserUpsertWithoutReadlistInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReadlistInput, UserUpdateWithoutReadlistInput>, UserUncheckedUpdateWithoutReadlistInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumTransactionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus
  }

  export type NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionStatusFilter<$PrismaModel>
    _max?: NestedEnumTransactionStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumReadlistStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReadlistStatus | EnumReadlistStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReadlistStatus[] | ListEnumReadlistStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReadlistStatus[] | ListEnumReadlistStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReadlistStatusFilter<$PrismaModel> | $Enums.ReadlistStatus
  }

  export type NestedEnumReadlistStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReadlistStatus | EnumReadlistStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReadlistStatus[] | ListEnumReadlistStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReadlistStatus[] | ListEnumReadlistStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReadlistStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReadlistStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReadlistStatusFilter<$PrismaModel>
    _max?: NestedEnumReadlistStatusFilter<$PrismaModel>
  }

  export type ReadingLogCreateWithoutUserInput = {
    id?: string
    startedAt?: Date | string
    lastReadAt?: Date | string
    ebook: EbookCreateNestedOneWithoutReadingLogsInput
  }

  export type ReadingLogUncheckedCreateWithoutUserInput = {
    id?: string
    ebookId: string
    startedAt?: Date | string
    lastReadAt?: Date | string
  }

  export type ReadingLogCreateOrConnectWithoutUserInput = {
    where: ReadingLogWhereUniqueInput
    create: XOR<ReadingLogCreateWithoutUserInput, ReadingLogUncheckedCreateWithoutUserInput>
  }

  export type ReadingLogCreateManyUserInputEnvelope = {
    data: ReadingLogCreateManyUserInput | ReadingLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ReadingProgressCreateWithoutUserInput = {
    id?: string
    currentLocation?: string | null
    progress?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ebook: EbookCreateNestedOneWithoutReadingProgressInput
  }

  export type ReadingProgressUncheckedCreateWithoutUserInput = {
    id?: string
    ebookId: string
    currentLocation?: string | null
    progress?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReadingProgressCreateOrConnectWithoutUserInput = {
    where: ReadingProgressWhereUniqueInput
    create: XOR<ReadingProgressCreateWithoutUserInput, ReadingProgressUncheckedCreateWithoutUserInput>
  }

  export type ReadingProgressCreateManyUserInputEnvelope = {
    data: ReadingProgressCreateManyUserInput | ReadingProgressCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ReadlistCreateWithoutUserInput = {
    id?: string
    status?: $Enums.ReadlistStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    ebook: EbookCreateNestedOneWithoutReadlistInput
  }

  export type ReadlistUncheckedCreateWithoutUserInput = {
    id?: string
    ebookId: string
    status?: $Enums.ReadlistStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReadlistCreateOrConnectWithoutUserInput = {
    where: ReadlistWhereUniqueInput
    create: XOR<ReadlistCreateWithoutUserInput, ReadlistUncheckedCreateWithoutUserInput>
  }

  export type ReadlistCreateManyUserInputEnvelope = {
    data: ReadlistCreateManyUserInput | ReadlistCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionCreateWithoutUserInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    planName: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    orderId?: string | null
    transactionId?: string | null
    grossAmount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateWithoutUserInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    planName: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    orderId?: string | null
    transactionId?: string | null
    grossAmount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionCreateOrConnectWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type AnnotationCreateWithoutUserInput = {
    id?: string
    cfiRange: string
    text: string
    type: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ebook: EbookCreateNestedOneWithoutAnnotationsInput
  }

  export type AnnotationUncheckedCreateWithoutUserInput = {
    id?: string
    ebookId: string
    cfiRange: string
    text: string
    type: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnnotationCreateOrConnectWithoutUserInput = {
    where: AnnotationWhereUniqueInput
    create: XOR<AnnotationCreateWithoutUserInput, AnnotationUncheckedCreateWithoutUserInput>
  }

  export type AnnotationCreateManyUserInputEnvelope = {
    data: AnnotationCreateManyUserInput | AnnotationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ReadingLogUpsertWithWhereUniqueWithoutUserInput = {
    where: ReadingLogWhereUniqueInput
    update: XOR<ReadingLogUpdateWithoutUserInput, ReadingLogUncheckedUpdateWithoutUserInput>
    create: XOR<ReadingLogCreateWithoutUserInput, ReadingLogUncheckedCreateWithoutUserInput>
  }

  export type ReadingLogUpdateWithWhereUniqueWithoutUserInput = {
    where: ReadingLogWhereUniqueInput
    data: XOR<ReadingLogUpdateWithoutUserInput, ReadingLogUncheckedUpdateWithoutUserInput>
  }

  export type ReadingLogUpdateManyWithWhereWithoutUserInput = {
    where: ReadingLogScalarWhereInput
    data: XOR<ReadingLogUpdateManyMutationInput, ReadingLogUncheckedUpdateManyWithoutUserInput>
  }

  export type ReadingLogScalarWhereInput = {
    AND?: ReadingLogScalarWhereInput | ReadingLogScalarWhereInput[]
    OR?: ReadingLogScalarWhereInput[]
    NOT?: ReadingLogScalarWhereInput | ReadingLogScalarWhereInput[]
    id?: StringFilter<"ReadingLog"> | string
    userId?: StringFilter<"ReadingLog"> | string
    ebookId?: StringFilter<"ReadingLog"> | string
    startedAt?: DateTimeFilter<"ReadingLog"> | Date | string
    lastReadAt?: DateTimeFilter<"ReadingLog"> | Date | string
  }

  export type ReadingProgressUpsertWithWhereUniqueWithoutUserInput = {
    where: ReadingProgressWhereUniqueInput
    update: XOR<ReadingProgressUpdateWithoutUserInput, ReadingProgressUncheckedUpdateWithoutUserInput>
    create: XOR<ReadingProgressCreateWithoutUserInput, ReadingProgressUncheckedCreateWithoutUserInput>
  }

  export type ReadingProgressUpdateWithWhereUniqueWithoutUserInput = {
    where: ReadingProgressWhereUniqueInput
    data: XOR<ReadingProgressUpdateWithoutUserInput, ReadingProgressUncheckedUpdateWithoutUserInput>
  }

  export type ReadingProgressUpdateManyWithWhereWithoutUserInput = {
    where: ReadingProgressScalarWhereInput
    data: XOR<ReadingProgressUpdateManyMutationInput, ReadingProgressUncheckedUpdateManyWithoutUserInput>
  }

  export type ReadingProgressScalarWhereInput = {
    AND?: ReadingProgressScalarWhereInput | ReadingProgressScalarWhereInput[]
    OR?: ReadingProgressScalarWhereInput[]
    NOT?: ReadingProgressScalarWhereInput | ReadingProgressScalarWhereInput[]
    id?: StringFilter<"ReadingProgress"> | string
    userId?: StringFilter<"ReadingProgress"> | string
    ebookId?: StringFilter<"ReadingProgress"> | string
    currentLocation?: StringNullableFilter<"ReadingProgress"> | string | null
    progress?: FloatFilter<"ReadingProgress"> | number
    createdAt?: DateTimeFilter<"ReadingProgress"> | Date | string
    updatedAt?: DateTimeFilter<"ReadingProgress"> | Date | string
  }

  export type ReadlistUpsertWithWhereUniqueWithoutUserInput = {
    where: ReadlistWhereUniqueInput
    update: XOR<ReadlistUpdateWithoutUserInput, ReadlistUncheckedUpdateWithoutUserInput>
    create: XOR<ReadlistCreateWithoutUserInput, ReadlistUncheckedCreateWithoutUserInput>
  }

  export type ReadlistUpdateWithWhereUniqueWithoutUserInput = {
    where: ReadlistWhereUniqueInput
    data: XOR<ReadlistUpdateWithoutUserInput, ReadlistUncheckedUpdateWithoutUserInput>
  }

  export type ReadlistUpdateManyWithWhereWithoutUserInput = {
    where: ReadlistScalarWhereInput
    data: XOR<ReadlistUpdateManyMutationInput, ReadlistUncheckedUpdateManyWithoutUserInput>
  }

  export type ReadlistScalarWhereInput = {
    AND?: ReadlistScalarWhereInput | ReadlistScalarWhereInput[]
    OR?: ReadlistScalarWhereInput[]
    NOT?: ReadlistScalarWhereInput | ReadlistScalarWhereInput[]
    id?: StringFilter<"Readlist"> | string
    userId?: StringFilter<"Readlist"> | string
    ebookId?: StringFilter<"Readlist"> | string
    status?: EnumReadlistStatusFilter<"Readlist"> | $Enums.ReadlistStatus
    createdAt?: DateTimeFilter<"Readlist"> | Date | string
    updatedAt?: DateTimeFilter<"Readlist"> | Date | string
  }

  export type SubscriptionUpsertWithoutUserInput = {
    update: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    where?: SubscriptionWhereInput
  }

  export type SubscriptionUpdateToOneWithWhereWithoutUserInput = {
    where?: SubscriptionWhereInput
    data: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type SubscriptionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    planName?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    grossAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    planName?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    grossAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type AnnotationUpsertWithWhereUniqueWithoutUserInput = {
    where: AnnotationWhereUniqueInput
    update: XOR<AnnotationUpdateWithoutUserInput, AnnotationUncheckedUpdateWithoutUserInput>
    create: XOR<AnnotationCreateWithoutUserInput, AnnotationUncheckedCreateWithoutUserInput>
  }

  export type AnnotationUpdateWithWhereUniqueWithoutUserInput = {
    where: AnnotationWhereUniqueInput
    data: XOR<AnnotationUpdateWithoutUserInput, AnnotationUncheckedUpdateWithoutUserInput>
  }

  export type AnnotationUpdateManyWithWhereWithoutUserInput = {
    where: AnnotationScalarWhereInput
    data: XOR<AnnotationUpdateManyMutationInput, AnnotationUncheckedUpdateManyWithoutUserInput>
  }

  export type AnnotationScalarWhereInput = {
    AND?: AnnotationScalarWhereInput | AnnotationScalarWhereInput[]
    OR?: AnnotationScalarWhereInput[]
    NOT?: AnnotationScalarWhereInput | AnnotationScalarWhereInput[]
    id?: StringFilter<"Annotation"> | string
    userId?: StringFilter<"Annotation"> | string
    ebookId?: StringFilter<"Annotation"> | string
    cfiRange?: StringFilter<"Annotation"> | string
    text?: StringFilter<"Annotation"> | string
    type?: StringFilter<"Annotation"> | string
    color?: StringNullableFilter<"Annotation"> | string | null
    createdAt?: DateTimeFilter<"Annotation"> | Date | string
    updatedAt?: DateTimeFilter<"Annotation"> | Date | string
  }

  export type UserCreateWithoutSubscriptionInput = {
    id?: string
    firebaseUid: string
    email: string
    name?: string | null
    photoUrl?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogCreateNestedManyWithoutUserInput
    readingProgress?: ReadingProgressCreateNestedManyWithoutUserInput
    readlist?: ReadlistCreateNestedManyWithoutUserInput
    annotations?: AnnotationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSubscriptionInput = {
    id?: string
    firebaseUid: string
    email: string
    name?: string | null
    photoUrl?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogUncheckedCreateNestedManyWithoutUserInput
    readingProgress?: ReadingProgressUncheckedCreateNestedManyWithoutUserInput
    readlist?: ReadlistUncheckedCreateNestedManyWithoutUserInput
    annotations?: AnnotationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSubscriptionInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
  }

  export type TransactionCreateWithoutSubscriptionInput = {
    id?: string
    orderId: string
    transactionStatus: $Enums.TransactionStatus
    grossAmount: number
    paymentType?: string | null
    transactionTime?: Date | string | null
    settlementTime?: Date | string | null
    webhookPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUncheckedCreateWithoutSubscriptionInput = {
    id?: string
    orderId: string
    transactionStatus: $Enums.TransactionStatus
    grossAmount: number
    paymentType?: string | null
    transactionTime?: Date | string | null
    settlementTime?: Date | string | null
    webhookPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateOrConnectWithoutSubscriptionInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutSubscriptionInput, TransactionUncheckedCreateWithoutSubscriptionInput>
  }

  export type TransactionCreateManySubscriptionInputEnvelope = {
    data: TransactionCreateManySubscriptionInput | TransactionCreateManySubscriptionInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutSubscriptionInput = {
    update: XOR<UserUpdateWithoutSubscriptionInput, UserUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSubscriptionInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSubscriptionInput, UserUncheckedUpdateWithoutSubscriptionInput>
  }

  export type UserUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUpdateManyWithoutUserNestedInput
    readingProgress?: ReadingProgressUpdateManyWithoutUserNestedInput
    readlist?: ReadlistUpdateManyWithoutUserNestedInput
    annotations?: AnnotationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUncheckedUpdateManyWithoutUserNestedInput
    readingProgress?: ReadingProgressUncheckedUpdateManyWithoutUserNestedInput
    readlist?: ReadlistUncheckedUpdateManyWithoutUserNestedInput
    annotations?: AnnotationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TransactionUpsertWithWhereUniqueWithoutSubscriptionInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutSubscriptionInput, TransactionUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<TransactionCreateWithoutSubscriptionInput, TransactionUncheckedCreateWithoutSubscriptionInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutSubscriptionInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutSubscriptionInput, TransactionUncheckedUpdateWithoutSubscriptionInput>
  }

  export type TransactionUpdateManyWithWhereWithoutSubscriptionInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutSubscriptionInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: StringFilter<"Transaction"> | string
    subscriptionId?: StringFilter<"Transaction"> | string
    orderId?: StringFilter<"Transaction"> | string
    transactionStatus?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus
    grossAmount?: IntFilter<"Transaction"> | number
    paymentType?: StringNullableFilter<"Transaction"> | string | null
    transactionTime?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    settlementTime?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    webhookPayload?: JsonNullableFilter<"Transaction">
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
  }

  export type SubscriptionCreateWithoutTransactionsInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    planName: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    orderId?: string | null
    transactionId?: string | null
    grossAmount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateWithoutTransactionsInput = {
    id?: string
    userId: string
    status?: $Enums.SubscriptionStatus
    planName: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    orderId?: string | null
    transactionId?: string | null
    grossAmount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionCreateOrConnectWithoutTransactionsInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutTransactionsInput, SubscriptionUncheckedCreateWithoutTransactionsInput>
  }

  export type SubscriptionUpsertWithoutTransactionsInput = {
    update: XOR<SubscriptionUpdateWithoutTransactionsInput, SubscriptionUncheckedUpdateWithoutTransactionsInput>
    create: XOR<SubscriptionCreateWithoutTransactionsInput, SubscriptionUncheckedCreateWithoutTransactionsInput>
    where?: SubscriptionWhereInput
  }

  export type SubscriptionUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: SubscriptionWhereInput
    data: XOR<SubscriptionUpdateWithoutTransactionsInput, SubscriptionUncheckedUpdateWithoutTransactionsInput>
  }

  export type SubscriptionUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    planName?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    grossAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    planName?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    grossAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingLogCreateWithoutEbookInput = {
    id?: string
    startedAt?: Date | string
    lastReadAt?: Date | string
    user: UserCreateNestedOneWithoutReadingLogsInput
  }

  export type ReadingLogUncheckedCreateWithoutEbookInput = {
    id?: string
    userId: string
    startedAt?: Date | string
    lastReadAt?: Date | string
  }

  export type ReadingLogCreateOrConnectWithoutEbookInput = {
    where: ReadingLogWhereUniqueInput
    create: XOR<ReadingLogCreateWithoutEbookInput, ReadingLogUncheckedCreateWithoutEbookInput>
  }

  export type ReadingLogCreateManyEbookInputEnvelope = {
    data: ReadingLogCreateManyEbookInput | ReadingLogCreateManyEbookInput[]
    skipDuplicates?: boolean
  }

  export type ReadingProgressCreateWithoutEbookInput = {
    id?: string
    currentLocation?: string | null
    progress?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutReadingProgressInput
  }

  export type ReadingProgressUncheckedCreateWithoutEbookInput = {
    id?: string
    userId: string
    currentLocation?: string | null
    progress?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReadingProgressCreateOrConnectWithoutEbookInput = {
    where: ReadingProgressWhereUniqueInput
    create: XOR<ReadingProgressCreateWithoutEbookInput, ReadingProgressUncheckedCreateWithoutEbookInput>
  }

  export type ReadingProgressCreateManyEbookInputEnvelope = {
    data: ReadingProgressCreateManyEbookInput | ReadingProgressCreateManyEbookInput[]
    skipDuplicates?: boolean
  }

  export type ReadlistCreateWithoutEbookInput = {
    id?: string
    status?: $Enums.ReadlistStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutReadlistInput
  }

  export type ReadlistUncheckedCreateWithoutEbookInput = {
    id?: string
    userId: string
    status?: $Enums.ReadlistStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReadlistCreateOrConnectWithoutEbookInput = {
    where: ReadlistWhereUniqueInput
    create: XOR<ReadlistCreateWithoutEbookInput, ReadlistUncheckedCreateWithoutEbookInput>
  }

  export type ReadlistCreateManyEbookInputEnvelope = {
    data: ReadlistCreateManyEbookInput | ReadlistCreateManyEbookInput[]
    skipDuplicates?: boolean
  }

  export type AnnotationCreateWithoutEbookInput = {
    id?: string
    cfiRange: string
    text: string
    type: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAnnotationsInput
  }

  export type AnnotationUncheckedCreateWithoutEbookInput = {
    id?: string
    userId: string
    cfiRange: string
    text: string
    type: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnnotationCreateOrConnectWithoutEbookInput = {
    where: AnnotationWhereUniqueInput
    create: XOR<AnnotationCreateWithoutEbookInput, AnnotationUncheckedCreateWithoutEbookInput>
  }

  export type AnnotationCreateManyEbookInputEnvelope = {
    data: AnnotationCreateManyEbookInput | AnnotationCreateManyEbookInput[]
    skipDuplicates?: boolean
  }

  export type CategoryCreateWithoutEbooksInput = {
    name: string
    slug: string
    icon?: string | null
    description?: string | null
    displayOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUncheckedCreateWithoutEbooksInput = {
    id?: number
    name: string
    slug: string
    icon?: string | null
    description?: string | null
    displayOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryCreateOrConnectWithoutEbooksInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutEbooksInput, CategoryUncheckedCreateWithoutEbooksInput>
  }

  export type ReadingLogUpsertWithWhereUniqueWithoutEbookInput = {
    where: ReadingLogWhereUniqueInput
    update: XOR<ReadingLogUpdateWithoutEbookInput, ReadingLogUncheckedUpdateWithoutEbookInput>
    create: XOR<ReadingLogCreateWithoutEbookInput, ReadingLogUncheckedCreateWithoutEbookInput>
  }

  export type ReadingLogUpdateWithWhereUniqueWithoutEbookInput = {
    where: ReadingLogWhereUniqueInput
    data: XOR<ReadingLogUpdateWithoutEbookInput, ReadingLogUncheckedUpdateWithoutEbookInput>
  }

  export type ReadingLogUpdateManyWithWhereWithoutEbookInput = {
    where: ReadingLogScalarWhereInput
    data: XOR<ReadingLogUpdateManyMutationInput, ReadingLogUncheckedUpdateManyWithoutEbookInput>
  }

  export type ReadingProgressUpsertWithWhereUniqueWithoutEbookInput = {
    where: ReadingProgressWhereUniqueInput
    update: XOR<ReadingProgressUpdateWithoutEbookInput, ReadingProgressUncheckedUpdateWithoutEbookInput>
    create: XOR<ReadingProgressCreateWithoutEbookInput, ReadingProgressUncheckedCreateWithoutEbookInput>
  }

  export type ReadingProgressUpdateWithWhereUniqueWithoutEbookInput = {
    where: ReadingProgressWhereUniqueInput
    data: XOR<ReadingProgressUpdateWithoutEbookInput, ReadingProgressUncheckedUpdateWithoutEbookInput>
  }

  export type ReadingProgressUpdateManyWithWhereWithoutEbookInput = {
    where: ReadingProgressScalarWhereInput
    data: XOR<ReadingProgressUpdateManyMutationInput, ReadingProgressUncheckedUpdateManyWithoutEbookInput>
  }

  export type ReadlistUpsertWithWhereUniqueWithoutEbookInput = {
    where: ReadlistWhereUniqueInput
    update: XOR<ReadlistUpdateWithoutEbookInput, ReadlistUncheckedUpdateWithoutEbookInput>
    create: XOR<ReadlistCreateWithoutEbookInput, ReadlistUncheckedCreateWithoutEbookInput>
  }

  export type ReadlistUpdateWithWhereUniqueWithoutEbookInput = {
    where: ReadlistWhereUniqueInput
    data: XOR<ReadlistUpdateWithoutEbookInput, ReadlistUncheckedUpdateWithoutEbookInput>
  }

  export type ReadlistUpdateManyWithWhereWithoutEbookInput = {
    where: ReadlistScalarWhereInput
    data: XOR<ReadlistUpdateManyMutationInput, ReadlistUncheckedUpdateManyWithoutEbookInput>
  }

  export type AnnotationUpsertWithWhereUniqueWithoutEbookInput = {
    where: AnnotationWhereUniqueInput
    update: XOR<AnnotationUpdateWithoutEbookInput, AnnotationUncheckedUpdateWithoutEbookInput>
    create: XOR<AnnotationCreateWithoutEbookInput, AnnotationUncheckedCreateWithoutEbookInput>
  }

  export type AnnotationUpdateWithWhereUniqueWithoutEbookInput = {
    where: AnnotationWhereUniqueInput
    data: XOR<AnnotationUpdateWithoutEbookInput, AnnotationUncheckedUpdateWithoutEbookInput>
  }

  export type AnnotationUpdateManyWithWhereWithoutEbookInput = {
    where: AnnotationScalarWhereInput
    data: XOR<AnnotationUpdateManyMutationInput, AnnotationUncheckedUpdateManyWithoutEbookInput>
  }

  export type CategoryUpsertWithoutEbooksInput = {
    update: XOR<CategoryUpdateWithoutEbooksInput, CategoryUncheckedUpdateWithoutEbooksInput>
    create: XOR<CategoryCreateWithoutEbooksInput, CategoryUncheckedCreateWithoutEbooksInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutEbooksInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutEbooksInput, CategoryUncheckedUpdateWithoutEbooksInput>
  }

  export type CategoryUpdateWithoutEbooksInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    displayOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateWithoutEbooksInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    displayOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EbookCreateWithoutCategoryRelInput = {
    id?: string
    title: string
    author: string
    description?: string | null
    coverUrl?: string | null
    pdfUrl?: string | null
    publicId?: string | null
    category: string
    isPremium?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogCreateNestedManyWithoutEbookInput
    readingProgress?: ReadingProgressCreateNestedManyWithoutEbookInput
    readlist?: ReadlistCreateNestedManyWithoutEbookInput
    annotations?: AnnotationCreateNestedManyWithoutEbookInput
  }

  export type EbookUncheckedCreateWithoutCategoryRelInput = {
    id?: string
    title: string
    author: string
    description?: string | null
    coverUrl?: string | null
    pdfUrl?: string | null
    publicId?: string | null
    category: string
    isPremium?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogUncheckedCreateNestedManyWithoutEbookInput
    readingProgress?: ReadingProgressUncheckedCreateNestedManyWithoutEbookInput
    readlist?: ReadlistUncheckedCreateNestedManyWithoutEbookInput
    annotations?: AnnotationUncheckedCreateNestedManyWithoutEbookInput
  }

  export type EbookCreateOrConnectWithoutCategoryRelInput = {
    where: EbookWhereUniqueInput
    create: XOR<EbookCreateWithoutCategoryRelInput, EbookUncheckedCreateWithoutCategoryRelInput>
  }

  export type EbookCreateManyCategoryRelInputEnvelope = {
    data: EbookCreateManyCategoryRelInput | EbookCreateManyCategoryRelInput[]
    skipDuplicates?: boolean
  }

  export type EbookUpsertWithWhereUniqueWithoutCategoryRelInput = {
    where: EbookWhereUniqueInput
    update: XOR<EbookUpdateWithoutCategoryRelInput, EbookUncheckedUpdateWithoutCategoryRelInput>
    create: XOR<EbookCreateWithoutCategoryRelInput, EbookUncheckedCreateWithoutCategoryRelInput>
  }

  export type EbookUpdateWithWhereUniqueWithoutCategoryRelInput = {
    where: EbookWhereUniqueInput
    data: XOR<EbookUpdateWithoutCategoryRelInput, EbookUncheckedUpdateWithoutCategoryRelInput>
  }

  export type EbookUpdateManyWithWhereWithoutCategoryRelInput = {
    where: EbookScalarWhereInput
    data: XOR<EbookUpdateManyMutationInput, EbookUncheckedUpdateManyWithoutCategoryRelInput>
  }

  export type EbookScalarWhereInput = {
    AND?: EbookScalarWhereInput | EbookScalarWhereInput[]
    OR?: EbookScalarWhereInput[]
    NOT?: EbookScalarWhereInput | EbookScalarWhereInput[]
    id?: StringFilter<"Ebook"> | string
    title?: StringFilter<"Ebook"> | string
    author?: StringFilter<"Ebook"> | string
    description?: StringNullableFilter<"Ebook"> | string | null
    coverUrl?: StringNullableFilter<"Ebook"> | string | null
    pdfUrl?: StringNullableFilter<"Ebook"> | string | null
    publicId?: StringNullableFilter<"Ebook"> | string | null
    category?: StringFilter<"Ebook"> | string
    categoryId?: IntNullableFilter<"Ebook"> | number | null
    isPremium?: BoolFilter<"Ebook"> | boolean
    isActive?: BoolFilter<"Ebook"> | boolean
    priority?: IntFilter<"Ebook"> | number
    createdAt?: DateTimeFilter<"Ebook"> | Date | string
    updatedAt?: DateTimeFilter<"Ebook"> | Date | string
  }

  export type EbookCreateWithoutReadingLogsInput = {
    id?: string
    title: string
    author: string
    description?: string | null
    coverUrl?: string | null
    pdfUrl?: string | null
    publicId?: string | null
    category: string
    isPremium?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    readingProgress?: ReadingProgressCreateNestedManyWithoutEbookInput
    readlist?: ReadlistCreateNestedManyWithoutEbookInput
    annotations?: AnnotationCreateNestedManyWithoutEbookInput
    categoryRel?: CategoryCreateNestedOneWithoutEbooksInput
  }

  export type EbookUncheckedCreateWithoutReadingLogsInput = {
    id?: string
    title: string
    author: string
    description?: string | null
    coverUrl?: string | null
    pdfUrl?: string | null
    publicId?: string | null
    category: string
    categoryId?: number | null
    isPremium?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    readingProgress?: ReadingProgressUncheckedCreateNestedManyWithoutEbookInput
    readlist?: ReadlistUncheckedCreateNestedManyWithoutEbookInput
    annotations?: AnnotationUncheckedCreateNestedManyWithoutEbookInput
  }

  export type EbookCreateOrConnectWithoutReadingLogsInput = {
    where: EbookWhereUniqueInput
    create: XOR<EbookCreateWithoutReadingLogsInput, EbookUncheckedCreateWithoutReadingLogsInput>
  }

  export type UserCreateWithoutReadingLogsInput = {
    id?: string
    firebaseUid: string
    email: string
    name?: string | null
    photoUrl?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    readingProgress?: ReadingProgressCreateNestedManyWithoutUserInput
    readlist?: ReadlistCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
    annotations?: AnnotationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutReadingLogsInput = {
    id?: string
    firebaseUid: string
    email: string
    name?: string | null
    photoUrl?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    readingProgress?: ReadingProgressUncheckedCreateNestedManyWithoutUserInput
    readlist?: ReadlistUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
    annotations?: AnnotationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutReadingLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReadingLogsInput, UserUncheckedCreateWithoutReadingLogsInput>
  }

  export type EbookUpsertWithoutReadingLogsInput = {
    update: XOR<EbookUpdateWithoutReadingLogsInput, EbookUncheckedUpdateWithoutReadingLogsInput>
    create: XOR<EbookCreateWithoutReadingLogsInput, EbookUncheckedCreateWithoutReadingLogsInput>
    where?: EbookWhereInput
  }

  export type EbookUpdateToOneWithWhereWithoutReadingLogsInput = {
    where?: EbookWhereInput
    data: XOR<EbookUpdateWithoutReadingLogsInput, EbookUncheckedUpdateWithoutReadingLogsInput>
  }

  export type EbookUpdateWithoutReadingLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingProgress?: ReadingProgressUpdateManyWithoutEbookNestedInput
    readlist?: ReadlistUpdateManyWithoutEbookNestedInput
    annotations?: AnnotationUpdateManyWithoutEbookNestedInput
    categoryRel?: CategoryUpdateOneWithoutEbooksNestedInput
  }

  export type EbookUncheckedUpdateWithoutReadingLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingProgress?: ReadingProgressUncheckedUpdateManyWithoutEbookNestedInput
    readlist?: ReadlistUncheckedUpdateManyWithoutEbookNestedInput
    annotations?: AnnotationUncheckedUpdateManyWithoutEbookNestedInput
  }

  export type UserUpsertWithoutReadingLogsInput = {
    update: XOR<UserUpdateWithoutReadingLogsInput, UserUncheckedUpdateWithoutReadingLogsInput>
    create: XOR<UserCreateWithoutReadingLogsInput, UserUncheckedCreateWithoutReadingLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReadingLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReadingLogsInput, UserUncheckedUpdateWithoutReadingLogsInput>
  }

  export type UserUpdateWithoutReadingLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingProgress?: ReadingProgressUpdateManyWithoutUserNestedInput
    readlist?: ReadlistUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
    annotations?: AnnotationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReadingLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingProgress?: ReadingProgressUncheckedUpdateManyWithoutUserNestedInput
    readlist?: ReadlistUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
    annotations?: AnnotationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type EbookCreateWithoutReadingProgressInput = {
    id?: string
    title: string
    author: string
    description?: string | null
    coverUrl?: string | null
    pdfUrl?: string | null
    publicId?: string | null
    category: string
    isPremium?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogCreateNestedManyWithoutEbookInput
    readlist?: ReadlistCreateNestedManyWithoutEbookInput
    annotations?: AnnotationCreateNestedManyWithoutEbookInput
    categoryRel?: CategoryCreateNestedOneWithoutEbooksInput
  }

  export type EbookUncheckedCreateWithoutReadingProgressInput = {
    id?: string
    title: string
    author: string
    description?: string | null
    coverUrl?: string | null
    pdfUrl?: string | null
    publicId?: string | null
    category: string
    categoryId?: number | null
    isPremium?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogUncheckedCreateNestedManyWithoutEbookInput
    readlist?: ReadlistUncheckedCreateNestedManyWithoutEbookInput
    annotations?: AnnotationUncheckedCreateNestedManyWithoutEbookInput
  }

  export type EbookCreateOrConnectWithoutReadingProgressInput = {
    where: EbookWhereUniqueInput
    create: XOR<EbookCreateWithoutReadingProgressInput, EbookUncheckedCreateWithoutReadingProgressInput>
  }

  export type UserCreateWithoutReadingProgressInput = {
    id?: string
    firebaseUid: string
    email: string
    name?: string | null
    photoUrl?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogCreateNestedManyWithoutUserInput
    readlist?: ReadlistCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
    annotations?: AnnotationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutReadingProgressInput = {
    id?: string
    firebaseUid: string
    email: string
    name?: string | null
    photoUrl?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogUncheckedCreateNestedManyWithoutUserInput
    readlist?: ReadlistUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
    annotations?: AnnotationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutReadingProgressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReadingProgressInput, UserUncheckedCreateWithoutReadingProgressInput>
  }

  export type EbookUpsertWithoutReadingProgressInput = {
    update: XOR<EbookUpdateWithoutReadingProgressInput, EbookUncheckedUpdateWithoutReadingProgressInput>
    create: XOR<EbookCreateWithoutReadingProgressInput, EbookUncheckedCreateWithoutReadingProgressInput>
    where?: EbookWhereInput
  }

  export type EbookUpdateToOneWithWhereWithoutReadingProgressInput = {
    where?: EbookWhereInput
    data: XOR<EbookUpdateWithoutReadingProgressInput, EbookUncheckedUpdateWithoutReadingProgressInput>
  }

  export type EbookUpdateWithoutReadingProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUpdateManyWithoutEbookNestedInput
    readlist?: ReadlistUpdateManyWithoutEbookNestedInput
    annotations?: AnnotationUpdateManyWithoutEbookNestedInput
    categoryRel?: CategoryUpdateOneWithoutEbooksNestedInput
  }

  export type EbookUncheckedUpdateWithoutReadingProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUncheckedUpdateManyWithoutEbookNestedInput
    readlist?: ReadlistUncheckedUpdateManyWithoutEbookNestedInput
    annotations?: AnnotationUncheckedUpdateManyWithoutEbookNestedInput
  }

  export type UserUpsertWithoutReadingProgressInput = {
    update: XOR<UserUpdateWithoutReadingProgressInput, UserUncheckedUpdateWithoutReadingProgressInput>
    create: XOR<UserCreateWithoutReadingProgressInput, UserUncheckedCreateWithoutReadingProgressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReadingProgressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReadingProgressInput, UserUncheckedUpdateWithoutReadingProgressInput>
  }

  export type UserUpdateWithoutReadingProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUpdateManyWithoutUserNestedInput
    readlist?: ReadlistUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
    annotations?: AnnotationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReadingProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUncheckedUpdateManyWithoutUserNestedInput
    readlist?: ReadlistUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
    annotations?: AnnotationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAnnotationsInput = {
    id?: string
    firebaseUid: string
    email: string
    name?: string | null
    photoUrl?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogCreateNestedManyWithoutUserInput
    readingProgress?: ReadingProgressCreateNestedManyWithoutUserInput
    readlist?: ReadlistCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAnnotationsInput = {
    id?: string
    firebaseUid: string
    email: string
    name?: string | null
    photoUrl?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogUncheckedCreateNestedManyWithoutUserInput
    readingProgress?: ReadingProgressUncheckedCreateNestedManyWithoutUserInput
    readlist?: ReadlistUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAnnotationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAnnotationsInput, UserUncheckedCreateWithoutAnnotationsInput>
  }

  export type EbookCreateWithoutAnnotationsInput = {
    id?: string
    title: string
    author: string
    description?: string | null
    coverUrl?: string | null
    pdfUrl?: string | null
    publicId?: string | null
    category: string
    isPremium?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogCreateNestedManyWithoutEbookInput
    readingProgress?: ReadingProgressCreateNestedManyWithoutEbookInput
    readlist?: ReadlistCreateNestedManyWithoutEbookInput
    categoryRel?: CategoryCreateNestedOneWithoutEbooksInput
  }

  export type EbookUncheckedCreateWithoutAnnotationsInput = {
    id?: string
    title: string
    author: string
    description?: string | null
    coverUrl?: string | null
    pdfUrl?: string | null
    publicId?: string | null
    category: string
    categoryId?: number | null
    isPremium?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogUncheckedCreateNestedManyWithoutEbookInput
    readingProgress?: ReadingProgressUncheckedCreateNestedManyWithoutEbookInput
    readlist?: ReadlistUncheckedCreateNestedManyWithoutEbookInput
  }

  export type EbookCreateOrConnectWithoutAnnotationsInput = {
    where: EbookWhereUniqueInput
    create: XOR<EbookCreateWithoutAnnotationsInput, EbookUncheckedCreateWithoutAnnotationsInput>
  }

  export type UserUpsertWithoutAnnotationsInput = {
    update: XOR<UserUpdateWithoutAnnotationsInput, UserUncheckedUpdateWithoutAnnotationsInput>
    create: XOR<UserCreateWithoutAnnotationsInput, UserUncheckedCreateWithoutAnnotationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAnnotationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAnnotationsInput, UserUncheckedUpdateWithoutAnnotationsInput>
  }

  export type UserUpdateWithoutAnnotationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUpdateManyWithoutUserNestedInput
    readingProgress?: ReadingProgressUpdateManyWithoutUserNestedInput
    readlist?: ReadlistUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAnnotationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUncheckedUpdateManyWithoutUserNestedInput
    readingProgress?: ReadingProgressUncheckedUpdateManyWithoutUserNestedInput
    readlist?: ReadlistUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
  }

  export type EbookUpsertWithoutAnnotationsInput = {
    update: XOR<EbookUpdateWithoutAnnotationsInput, EbookUncheckedUpdateWithoutAnnotationsInput>
    create: XOR<EbookCreateWithoutAnnotationsInput, EbookUncheckedCreateWithoutAnnotationsInput>
    where?: EbookWhereInput
  }

  export type EbookUpdateToOneWithWhereWithoutAnnotationsInput = {
    where?: EbookWhereInput
    data: XOR<EbookUpdateWithoutAnnotationsInput, EbookUncheckedUpdateWithoutAnnotationsInput>
  }

  export type EbookUpdateWithoutAnnotationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUpdateManyWithoutEbookNestedInput
    readingProgress?: ReadingProgressUpdateManyWithoutEbookNestedInput
    readlist?: ReadlistUpdateManyWithoutEbookNestedInput
    categoryRel?: CategoryUpdateOneWithoutEbooksNestedInput
  }

  export type EbookUncheckedUpdateWithoutAnnotationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUncheckedUpdateManyWithoutEbookNestedInput
    readingProgress?: ReadingProgressUncheckedUpdateManyWithoutEbookNestedInput
    readlist?: ReadlistUncheckedUpdateManyWithoutEbookNestedInput
  }

  export type EbookCreateWithoutReadlistInput = {
    id?: string
    title: string
    author: string
    description?: string | null
    coverUrl?: string | null
    pdfUrl?: string | null
    publicId?: string | null
    category: string
    isPremium?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogCreateNestedManyWithoutEbookInput
    readingProgress?: ReadingProgressCreateNestedManyWithoutEbookInput
    annotations?: AnnotationCreateNestedManyWithoutEbookInput
    categoryRel?: CategoryCreateNestedOneWithoutEbooksInput
  }

  export type EbookUncheckedCreateWithoutReadlistInput = {
    id?: string
    title: string
    author: string
    description?: string | null
    coverUrl?: string | null
    pdfUrl?: string | null
    publicId?: string | null
    category: string
    categoryId?: number | null
    isPremium?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogUncheckedCreateNestedManyWithoutEbookInput
    readingProgress?: ReadingProgressUncheckedCreateNestedManyWithoutEbookInput
    annotations?: AnnotationUncheckedCreateNestedManyWithoutEbookInput
  }

  export type EbookCreateOrConnectWithoutReadlistInput = {
    where: EbookWhereUniqueInput
    create: XOR<EbookCreateWithoutReadlistInput, EbookUncheckedCreateWithoutReadlistInput>
  }

  export type UserCreateWithoutReadlistInput = {
    id?: string
    firebaseUid: string
    email: string
    name?: string | null
    photoUrl?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogCreateNestedManyWithoutUserInput
    readingProgress?: ReadingProgressCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
    annotations?: AnnotationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutReadlistInput = {
    id?: string
    firebaseUid: string
    email: string
    name?: string | null
    photoUrl?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    readingLogs?: ReadingLogUncheckedCreateNestedManyWithoutUserInput
    readingProgress?: ReadingProgressUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
    annotations?: AnnotationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutReadlistInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReadlistInput, UserUncheckedCreateWithoutReadlistInput>
  }

  export type EbookUpsertWithoutReadlistInput = {
    update: XOR<EbookUpdateWithoutReadlistInput, EbookUncheckedUpdateWithoutReadlistInput>
    create: XOR<EbookCreateWithoutReadlistInput, EbookUncheckedCreateWithoutReadlistInput>
    where?: EbookWhereInput
  }

  export type EbookUpdateToOneWithWhereWithoutReadlistInput = {
    where?: EbookWhereInput
    data: XOR<EbookUpdateWithoutReadlistInput, EbookUncheckedUpdateWithoutReadlistInput>
  }

  export type EbookUpdateWithoutReadlistInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUpdateManyWithoutEbookNestedInput
    readingProgress?: ReadingProgressUpdateManyWithoutEbookNestedInput
    annotations?: AnnotationUpdateManyWithoutEbookNestedInput
    categoryRel?: CategoryUpdateOneWithoutEbooksNestedInput
  }

  export type EbookUncheckedUpdateWithoutReadlistInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUncheckedUpdateManyWithoutEbookNestedInput
    readingProgress?: ReadingProgressUncheckedUpdateManyWithoutEbookNestedInput
    annotations?: AnnotationUncheckedUpdateManyWithoutEbookNestedInput
  }

  export type UserUpsertWithoutReadlistInput = {
    update: XOR<UserUpdateWithoutReadlistInput, UserUncheckedUpdateWithoutReadlistInput>
    create: XOR<UserCreateWithoutReadlistInput, UserUncheckedCreateWithoutReadlistInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReadlistInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReadlistInput, UserUncheckedUpdateWithoutReadlistInput>
  }

  export type UserUpdateWithoutReadlistInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUpdateManyWithoutUserNestedInput
    readingProgress?: ReadingProgressUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
    annotations?: AnnotationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReadlistInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUncheckedUpdateManyWithoutUserNestedInput
    readingProgress?: ReadingProgressUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
    annotations?: AnnotationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ReadingLogCreateManyUserInput = {
    id?: string
    ebookId: string
    startedAt?: Date | string
    lastReadAt?: Date | string
  }

  export type ReadingProgressCreateManyUserInput = {
    id?: string
    ebookId: string
    currentLocation?: string | null
    progress?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReadlistCreateManyUserInput = {
    id?: string
    ebookId: string
    status?: $Enums.ReadlistStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnnotationCreateManyUserInput = {
    id?: string
    ebookId: string
    cfiRange: string
    text: string
    type: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReadingLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ebook?: EbookUpdateOneRequiredWithoutReadingLogsNestedInput
  }

  export type ReadingLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingProgressUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentLocation?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ebook?: EbookUpdateOneRequiredWithoutReadingProgressNestedInput
  }

  export type ReadingProgressUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    currentLocation?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingProgressUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    currentLocation?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadlistUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumReadlistStatusFieldUpdateOperationsInput | $Enums.ReadlistStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ebook?: EbookUpdateOneRequiredWithoutReadlistNestedInput
  }

  export type ReadlistUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    status?: EnumReadlistStatusFieldUpdateOperationsInput | $Enums.ReadlistStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadlistUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    status?: EnumReadlistStatusFieldUpdateOperationsInput | $Enums.ReadlistStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnotationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    cfiRange?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ebook?: EbookUpdateOneRequiredWithoutAnnotationsNestedInput
  }

  export type AnnotationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    cfiRange?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnotationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ebookId?: StringFieldUpdateOperationsInput | string
    cfiRange?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManySubscriptionInput = {
    id?: string
    orderId: string
    transactionStatus: $Enums.TransactionStatus
    grossAmount: number
    paymentType?: string | null
    transactionTime?: Date | string | null
    settlementTime?: Date | string | null
    webhookPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    transactionStatus?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    grossAmount?: IntFieldUpdateOperationsInput | number
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settlementTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    webhookPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    transactionStatus?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    grossAmount?: IntFieldUpdateOperationsInput | number
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settlementTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    webhookPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    transactionStatus?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    grossAmount?: IntFieldUpdateOperationsInput | number
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settlementTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    webhookPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingLogCreateManyEbookInput = {
    id?: string
    userId: string
    startedAt?: Date | string
    lastReadAt?: Date | string
  }

  export type ReadingProgressCreateManyEbookInput = {
    id?: string
    userId: string
    currentLocation?: string | null
    progress?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReadlistCreateManyEbookInput = {
    id?: string
    userId: string
    status?: $Enums.ReadlistStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnnotationCreateManyEbookInput = {
    id?: string
    userId: string
    cfiRange: string
    text: string
    type: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReadingLogUpdateWithoutEbookInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutReadingLogsNestedInput
  }

  export type ReadingLogUncheckedUpdateWithoutEbookInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingLogUncheckedUpdateManyWithoutEbookInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingProgressUpdateWithoutEbookInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentLocation?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutReadingProgressNestedInput
  }

  export type ReadingProgressUncheckedUpdateWithoutEbookInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    currentLocation?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingProgressUncheckedUpdateManyWithoutEbookInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    currentLocation?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadlistUpdateWithoutEbookInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumReadlistStatusFieldUpdateOperationsInput | $Enums.ReadlistStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutReadlistNestedInput
  }

  export type ReadlistUncheckedUpdateWithoutEbookInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumReadlistStatusFieldUpdateOperationsInput | $Enums.ReadlistStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadlistUncheckedUpdateManyWithoutEbookInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumReadlistStatusFieldUpdateOperationsInput | $Enums.ReadlistStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnotationUpdateWithoutEbookInput = {
    id?: StringFieldUpdateOperationsInput | string
    cfiRange?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAnnotationsNestedInput
  }

  export type AnnotationUncheckedUpdateWithoutEbookInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cfiRange?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnotationUncheckedUpdateManyWithoutEbookInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cfiRange?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EbookCreateManyCategoryRelInput = {
    id?: string
    title: string
    author: string
    description?: string | null
    coverUrl?: string | null
    pdfUrl?: string | null
    publicId?: string | null
    category: string
    isPremium?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EbookUpdateWithoutCategoryRelInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUpdateManyWithoutEbookNestedInput
    readingProgress?: ReadingProgressUpdateManyWithoutEbookNestedInput
    readlist?: ReadlistUpdateManyWithoutEbookNestedInput
    annotations?: AnnotationUpdateManyWithoutEbookNestedInput
  }

  export type EbookUncheckedUpdateWithoutCategoryRelInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingLogs?: ReadingLogUncheckedUpdateManyWithoutEbookNestedInput
    readingProgress?: ReadingProgressUncheckedUpdateManyWithoutEbookNestedInput
    readlist?: ReadlistUncheckedUpdateManyWithoutEbookNestedInput
    annotations?: AnnotationUncheckedUpdateManyWithoutEbookNestedInput
  }

  export type EbookUncheckedUpdateManyWithoutCategoryRelInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SubscriptionCountOutputTypeDefaultArgs instead
     */
    export type SubscriptionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SubscriptionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EbookCountOutputTypeDefaultArgs instead
     */
    export type EbookCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EbookCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CategoryCountOutputTypeDefaultArgs instead
     */
    export type CategoryCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CategoryCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SubscriptionDefaultArgs instead
     */
    export type SubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SubscriptionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TransactionDefaultArgs instead
     */
    export type TransactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TransactionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EbookDefaultArgs instead
     */
    export type EbookArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EbookDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CategoryDefaultArgs instead
     */
    export type CategoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CategoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BannerDefaultArgs instead
     */
    export type BannerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BannerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReadingLogDefaultArgs instead
     */
    export type ReadingLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReadingLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AdminEventDefaultArgs instead
     */
    export type AdminEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AdminEventDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReadingProgressDefaultArgs instead
     */
    export type ReadingProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReadingProgressDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AnnotationDefaultArgs instead
     */
    export type AnnotationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AnnotationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReadlistDefaultArgs instead
     */
    export type ReadlistArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReadlistDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}