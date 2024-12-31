import { activeEffect} from "./effect";

//  收集依赖
export  function  track(target: any, key: string) {

    console.log("track", key, activeEffect)


}