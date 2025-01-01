import {activeEffect, trackEffect, triggerEffects} from "./effect";


const targetMap = new WeakMap<Object, Map<string, any>>();


export function createDep(clearUp, key) {
    let dep = new Map() as any;
    dep.clearUp = clearUp
    dep.name = key
    return dep
}

//  收集依赖
export function track(target: Object, key) {
    if (activeEffect) {
        let depMap = targetMap.get(target);
        if (!depMap) {
            targetMap.set(target, (depMap = new Map()));
        }
        let dep = depMap.get(key);
        if (!dep) {
            depMap.set(
                key,
                (dep = createDep(() => depMap.delete(key), key))
            )
        }
        trackEffect(activeEffect, dep)
    }
}

//   触发依赖
export function trigger(target: Object, key, newValue: any, oldValue: any) {
    const depMap = targetMap.get(target);
    if (!depMap) {
        return
    }
    const dep = depMap.get(key);
    if (dep) {
        triggerEffects(dep)
    }
}