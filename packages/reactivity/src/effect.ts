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
    private active = true

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
            this.active = false
            activeEffect = this
            return this.fn()
        } finally {
            activeEffect = lastEffect
            this.active = true
        }
    }
}