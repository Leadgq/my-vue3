import {isObject} from "@vue/shared";
import {mutableHandlers, ReactiveFlags} from "./baseHandler";

const reactiveMap = new WeakMap();


function createReactiveObject(target: Record<string, any>) {
    // 如果当前不是对象，则直接返回
    if (!isObject(target)) {
        return target;
    }

    // 如果当前被代理，还要进行代理
    if (target[ReactiveFlags.IS_REACTIVE]) {
        return target;
    }

    // 如果已经代理过，则直接返回
    if (reactiveMap.has(target)) {
        return reactiveMap.get(target);
    }

    let proxy = new Proxy(target, mutableHandlers);
    reactiveMap.set(target, proxy);
    return proxy;
}

export function reactive(target: Record<string, any>) {
    return createReactiveObject(target);
}
