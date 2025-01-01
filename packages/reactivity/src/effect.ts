export function effect(fn: () => any, options?: any) {
    const _effect = new ReactiveEffect(fn, () => {
        // scheduler
        _effect.run()
    })
    _effect.run()

    return _effect
}

export let activeEffect: ReactiveEffect | undefined

class ReactiveEffect {
    public active = true
    tracked_Id = 0;
    deps: any[] = [];
    depsLength = 0;

    constructor(public fn: () => any, public scheduler) {
    }

    run() {
        // 如果不是激活, 后续操作不执行
        if (!this.active) {
            return this.fn();
        }
        // 保存上一个激活的effect、最后的值为undefined
        let lastEffect = activeEffect;
        try {
            activeEffect = this
            return this.fn()
        } finally {
            activeEffect = lastEffect
        }
    }

    //  todo
    stop() {
        this.active = false
    }
}

// 双向记忆
export function trackEffect(effect: ReactiveEffect, dep: any) {
    console.log(effect, dep)
    dep.set(effect, effect.tracked_Id);
    effect.deps[effect.depsLength++] = dep
}

// 触发effect
export function triggerEffects(dep) {
    for (const effect of dep.keys()) {
        if (effect.scheduler) {
            effect.scheduler();
        }
    }
}