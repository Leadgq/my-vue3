import { isObject } from "@vue/shared";

const reactiveMap = new WeakMap();

enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    Reflect.set(target, key, value, receiver);
    return true;
  },
};

export function reactive(target: Record<string, any>) {
  return createReactiveObject(target);
}

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
