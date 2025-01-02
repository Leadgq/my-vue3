export function effect(fn: () => any, options?: any) {
  const _effect = new ReactiveEffect(fn, () => {
    // scheduler
    _effect.run();
  });
  _effect.run();

  return _effect;
}

export let activeEffect: ReactiveEffect | undefined;

function cleanPreEffect(effect: ReactiveEffect) {
  effect.depsLength = 0; // 清空depsLength
  effect.tracked_Id++; // 每次执行effect, 都会让tracked_Id++
}

function cleanPostEffect(effect: ReactiveEffect) {
  if (effect.deps.length > effect.depsLength) {
    for (let i = effect.depsLength; i < effect.deps.length; i++) {
      cleanDepEffect(effect.deps[i], effect);
    }
    effect.deps.length = effect.depsLength;
  }
}

class ReactiveEffect {
  public active = true;
  tracked_Id = 0;
  deps: any[] = [];
  depsLength = 0;

  constructor(public fn: () => any, public scheduler) {}

  run() {
    // 如果不是激活, 后续操作不执行
    if (!this.active) {
      return this.fn();
    }
    // 保存上一个激活的effect、最后的值为undefined
    let lastEffect = activeEffect;
    try {
      activeEffect = this;
      cleanPreEffect(this);
      return this.fn();
    } finally {
      activeEffect = lastEffect;
      cleanPostEffect(this);
    }
  }

  //  todo
  stop() {
    this.active = false;
  }
}

function cleanDepEffect(dep: any, effect: ReactiveEffect) {
  dep.delete(effect);
  if (dep.size === 0) {
    dep.clearUp();
  }
}

// 双向记忆
export function trackEffect(effect: ReactiveEffect, dep: any) {
  if (dep.get(effect) !== effect.tracked_Id) {
    dep.set(effect, effect.tracked_Id);
    const oldDep = effect.deps[effect.depsLength];
    // 新旧不同的diff
    if (oldDep !== dep) {
      //  删除
      if (oldDep) {
        cleanDepEffect(oldDep, effect);
      }
      effect.deps[effect.depsLength++] = dep;
    } else {
      // 跳过
      effect.depsLength++;
    }
  }
}

// 触发effect
export function triggerEffects(dep) {
  for (const effect of dep.keys()) {
    if (effect.scheduler) {
      effect.scheduler();
    }
  }
}
