// Type definitions for express-decorator-router 0.2.1
// Project: https://github.com/LucasMendesl/express-decorator-router/blob/master/README.md
// Definitions by: Lucas Mendes Loureiro <https://github.com/LucasMendesl>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="express" />
/// <reference types="awilix" />

import * as awilix from 'awilix'
import * as express from 'express'

declare namespace controllers {

    export const awilix: any

    export type ResolverDepsFn = (...args?: any[]) => any | string
    export type RouteFn = (target: object, property: string) => void
    export type ControllerFn = (target: object, handler: object) => any

    export type FactoryResolverFn =
      awilix.ClassOrFunctionReturning<any> |
      awilix.Resolver<any>

    interface RouterRequest extends express.Request {
        [container: string]: any
    }

    interface RouterControllerConfig {
        router: express.IRouter
        controllerExpression: string
    }

    interface RouterRequestParams {
        request: RouterRequest
        response: express.Response
        next: express.NextFunction
    }

    export function all(...args: any[]): RouteFn;

    export function del(...args: any[]): RouteFn;

    export function get(...args: any[]): RouteFn;

    export function put(...args: any[]): RouteFn;

    export function head(...args: any[]): RouteFn;

    export function post(...args: any[]): RouteFn;

    export function patch(...args: any[]): RouteFn;

    export function options(...args: any[]): RouteFn;

    export function route(method: string, ...args: any[]): RouteFn;

    export function inject(factory: FactoryResolverFn): ResolverDepsFn;

    export function scopePerRequest(container: awilix.AwilixContainer): express.RequestHandler;

    export function useControllers(configuration?: RouterControllerConfig): express.RequestHandler;

    export function useAwilixControllers(configuration?: RouterControllerConfig): express.RequestHandler;

    export function controller(controllerPath?: string, ...middlewares?: express.RequestHandler[]): ControllerFn;
}

export = controllers
