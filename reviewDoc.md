# Vue官网细节


## 基础


### 响应式基础


1. vue响应式是如何工作的？

当你在模板中使用了一个 ref，然后改变了这个 ref 的值时，Vue 会自动检测到这个变化，并且相应地更新 DOM。

这是通过一个基于依赖追踪的响应式系统实现的。当一个组件首次渲染时，Vue 会追踪在渲染过程中使用的每一个 ref。

然后，当一个 ref 被修改时，它会触发追踪它的组件的一次重新渲染。

在标准的 JavaScript 中，检测普通变量的访问或修改是行不通的。然而，我们可以通过 getter 和 setter 方法来拦截对象属性的 get 和 set 操作。

该 .value 属性给予了 Vue 一个机会来检测 ref 何时被访问或修改。在其内部，Vue 在它的 getter 中执行追踪，在它的 setter 中执行触发。从概念上讲，你可以将 ref 看作是一个像这样的对象：

``` js
// 伪代码，不是真正的实现
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```

另一个 ref 的好处是，与普通变量不同，你可以将 ref 传递给函数，同时保留对最新值和响应式连接的访问。当将复杂的逻辑重构为可重用的代码时，这将非常有用。



2. shallowRef 减少大型不可变数据的响应性开销

Vue 的响应性系统默认是深度的。虽然这让状态管理变得更直观，但在数据量巨大时，深度响应性也会导致不小的性能负担

通过使用 shallowRef() 和 shallowReactive() 来绕开深度响应。浅层式 API 创建的状态只在其顶层是响应式的，对所有深层的对象不会做任何处理。这使得对深层级属性的访问变得更快，但代价是，我们现在必须将所有深层级对象视为不可变的，并且只能通过替换整个根状态来触发更新：

``` js
const shallowArray = shallowRef([
  /* 巨大的列表，里面包含深层的对象 */
])

// 这不会触发更新...
shallowArray.value.push(newObject)
// 这才会触发更新
shallowArray.value = [...shallowArray.value, newObject]
// 这不会触发更新...
shallowArray.value[0].foo = 1
// 这才会触发更新
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1
  },
  ...shallowArray.value.slice(1)
]
```

3. shallowRef 与外部状态系统集成 --- 不可变数据

如果你正在实现一个撤销/重做的功能，你可能想要对用户编辑时应用的状态进行快照记录。然而，如果状态树很大的话，Vue 的可变响应性系统没法很好地处理这种情况，因为在每次更新时都序列化整个状态对象对 CPU 和内存开销来说都是非常昂贵的。

不可变数据结构通过永不更改状态对象来解决这个问题。与 Vue 不同的是，它会创建一个新对象，保留旧的对象未发生改变的一部分。在 JavaScript 中有多种不同的方式来使用不可变数据，但我们推荐使用 Immer 搭配 Vue，因为它使你可以在保持原有直观、可变的语法的同时，使用不可变数据。

我们可以通过一个简单的组合式函数来集成 Immer：

``` js
import { produce } from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

4. 与状态机 `Xstate` 和 异步事件流 `Rxjs` 结合
5. reactive reactive() 将深层地转换对象：当访问嵌套对象时，它们也会被 reactive() 包装。当 ref 的值是一个对象时，ref() 也会在内部调用它。

``` js
const deepObj = {
  bob:{
    name:'bob',
    age:'11',
  },
  Tom:{
    name:'tom',
    age:'12'
  }
}
const reactiveDeepObj = reactive(deepObj)
 // reactiveDeepObj 与 reactiveDeepObj.Tom 都是reactive对象
console.log(reactiveDeepObj,reactiveDeepObj.Tom);
```

6. reactive() API 有一些局限性：
+ 有限的值类型  
+ 不能替换整个对象
+ 对解构操作不友好: 当我们将响应式对象的原始类型属性解构为本地变量时，或者将该属性传递给函数时，我们将丢失响应性连接：

7. 自动解包问题： 
+ 只有当嵌套在一个深层响应式对象内时，才会发生 ref 解包。当其作为浅层响应式对象`(shallowReactive)`的属性被访问时不会解包。 
+ 当 ref 作为响应式数组或原生集合类型 (如 Map) 中的元素被访问时，它不会被解包：
+ 在模板渲染上下文中，只有顶级的 ref 属性才会被解包。

``` js
const count = ref(0)
const object = { id: ref(1) }


// {{ count + 1 }} 可以正常工作
// {{ object.id + 1 }} 不会
```



### 计算属性

1. 计算属性 vs 方法

计算属性值会基于其响应式依赖被缓存。一个计算属性仅会在其响应式依赖更新时才重新计算。


2. Getter 不应该有副作用 

计算属性的 getter 应只做计算而没有任何其他的副作用，这一点非常重要，请务必牢记。

不要改变其他状态、在 getter 中做异步请求或者更改 DOM！一个计算属性的声明中描述的是如何根据其他值派生一个值。因此 getter 的职责应该仅为计算和返回该值。

3. 避免直接修改计算属性值

从计算属性返回的值是派生状态。可以把它看作是一个“临时快照”，每当源状态发生变化时，就会创建一个新的快照。

更改快照是没有意义的，因此计算属性的返回值应该被视为只读的，并且永远不应该被更改——应该更新它所依赖的源状态以触发新的计算。



### 类与样式绑定

1. 绑定组件: 如果组件是多根组件，需要制定哪个跟元素来接受这个class 可以通过组件的`$attrs` 属性来制定接手的元素。

``` html
<!-- MyComponent 模板使用 $attrs 时 -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
```


2. 自动前缀, 当你在 :style 中使用了需要浏览器特殊前缀的 CSS 属性时，Vue 会自动为他们加上相应的前缀。Vue 是在运行时检查该属性是否支持在当前浏览器中使用。如果浏览器不支持某个属性，那么将尝试加上各个浏览器特殊前缀，以找到哪一个是被支持的。

``` html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>

``` 

数组仅会渲染浏览器支持的最后一个值。在这个示例中，在支持不需要特别前缀的浏览器中都会渲染为 display: flex。


### 条件渲染

1. v-if 和 v-for: 当 v-if 和 v-for 同时存在于一个元素上的时候，v-if 会首先被执行。


### 列表渲染
1. v-for, 可以在定义 v-for 的变量别名时使用解构

``` html
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- 有 index 索引时 -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

也可以使用 of 作为分隔符来替代 in，这更接近 JavaScript 的迭代器语法：

``` html
<div v-for="item of items"></div>
```


2. v-for & 对象

你也可以使用 v-for 来遍历一个对象的所有属性。遍历的顺序会基于对该对象调用 Object.keys() 的返回值来决定。

``` html
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>

<script>
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
</script>
```


3. 在 v-for 里使用范围值，此处n从 1 开始 而非 0 

``` html
<span v-for="n in 10">{{ n }}</span> 
```


4. v-if 和 v-for: 当它们同时存在于一个节点上时，v-if 比 v-for 的优先级更高。这意味着 v-if 的条件将无法访问到 v-for 作用域内定义的变量别名：

``` html
<!--
 这会抛出一个错误，因为属性 todo 此时
 没有在该实例上定义
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```


在外先包装一层 <template> 再在其上使用 v-for 可以解决这个问题 (这也更加明显易读)

``` html
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```


5. Vue 默认按照“就地更新”的策略来更新通过 v-for 渲染的元素列表。

当数据项的顺序改变时，Vue 不会随之移动 DOM 元素的顺序，而是就地更新每个元素，确保它们在原本指定的索引位置上渲染。

默认模式是高效的，但只适用于列表渲染输出的结果不依赖子组件状态或者临时 DOM 状态 (例如表单输入值) 的情况。

key 绑定的值期望是一个基础类型的值，例如字符串或 number symbol 类型。不要用对象作为 v-for 的 key。


6. 展示过滤或排序后的结果

有时，我们希望显示数组经过过滤或排序后的内容，而不实际变更或重置原始数据。在这种情况下，你可以创建返回已过滤或已排序数组的计算属性。


### 事件处理

1. 事件修饰符： 

.stop
.prevent
.self
.capture
.once
.passive

使用修饰符时需要注意调用顺序，因为相关代码是以相同的顺序生成的。因此使用 @click.prevent.self 会阻止元素及其子元素的所有点击事件的默认行为，而 @click.self.prevent 则只会阻止对元素本身的点击事件的默认行为


请勿同时使用 .passive 和 .prevent，因为 .passive 已经向浏览器表明了你不想阻止事件的默认行为。如果你这么做了，则 .prevent 会被忽略，并且浏览器会抛出警告。


.exact 修饰符

``` html
<!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 仅当没有按下任何系统按键时触发 -->
<button @click.exact="onClick">A</button>
```


### 表单输入绑定


1. v-model

文本类型的 `<input>` 和 `<textarea>` 元素会绑定 value property 并侦听 input 事件；
`<input type="checkbox">` 和 `<input type="radio">` 会绑定 checked property 并侦听 change 事件；
`<select>` 会绑定 value property 并侦听 change 事件。

注意在 `<textarea>` 中是不支持插值表达式的。请使用 v-model 来替代：

v-model 会忽略任何表单元素上初始的 value、checked 或 selected attribute。它将始终将当前绑定的 JavaScript 状态视为数据的正确来源。你应该在 JavaScript 中使用响应式系统的 API来声明该初始值。


2. input textarea  对于IME的语言（中日韩文等） v-model 不会在拼字阶段时触发更新，如果你的确想在拼字阶段也触发更新，请直接使用自己的 input 事件监听器和 value 绑定而不要使用 v-model。


3. 复选框， 单一的复选框绑定`boolean`  可以将多个复选框绑定到同一个数组或集合的值

``` html
<div>Checked names: {{ checkedNames }}</div>

<input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
<label for="jack">Jack</label>

<input type="checkbox" id="john" value="John" v-model="checkedNames" />
<label for="john">John</label>

<input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
<label for="mike">Mike</label>

<script>
  const checkedNames = ref([])
</script>

```


4. 选择器

如果 v-model 表达式的初始值不匹配任何一个选择项，<select> 元素会渲染成一个“未选择”的状态。在 iOS 上，这将导致用户无法选择第一项，因为 iOS 在这种情况下不会触发一个 change 事件。因此，我们建议提供一个空值的禁用选项，如上面的例子所示。


5. true-value 和 false-value 是 Vue 特有的 attributes，仅支持和 v-model 配套使用。这里 toggle 属性的值会在选中时被设为 'yes'，取消选择时设为 'no'。你同样可以通过 v-bind 将其绑定为其他动态值

``` html
<input
  type="checkbox"
  v-model="toggle"
  :true-value="dynamicTrueValue"
  :false-value="dynamicFalseValue" />
```


6. 修饰符

.lazy: 默认情况下，v-model 会在每次 input 事件后更新数据 (IME 拼字阶段的状态例外)。你可以添加 lazy 修饰符来改为在每次 change 事件后更新数据：

.number: 如果你想让用户输入自动转换为数字，你可以在 v-model 后添加 .number 修饰符来管理输入

.trim: 默认去除用户输入内容中两端的空格



### 生命周期

1. vue完整版 和 runtime 版本 区别，

一个完整的Vue版本是包含编译器的，我们可以使用template选项进行模板编写。编译器会自动将template选项中的模板字符串编译成渲染函数的代码,源码中就是render函数。

只包含运行时的版本拥有创建Vue实例、渲染并处理Virtual DOM等功能，基本上就是除去编译器外的完整代码。该版本的适用场景有两种：

我们在选项中通过手写render函数去定义渲染过程，这个时候并不需要包含编译器的版本便可完整执行。

借助vue-loader这样的编译工具进行编译，当我们利用webpack进行Vue的工程化开发时，常常会利用vue-loader对*.vue文件进行编译，尽管我们也是利用template模板标签去书写代码，但是此时的Vue已经不需要利用编译器去负责模板的编译工作了，这个过程交给了插件去实现。





### 观察者

1. 使用数组 我们可以在一个watcher里监听多个

``` js
const x = ref(0)
const y = ref(0)

// single ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// array of multiple sources
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```


2. watchEffect 仅会在其同步执行期间，才追踪依赖。在使用异步回调时，只有在第一个 await 正常工作前访问到的属性才会被追踪。
3. 一次性侦听器: 每当被侦听源发生变化时，侦听器的回调就会执行。如果希望回调只在源变化时触发一次，请使用 once: true 选项。

``` js
watch(
  source,
  (newValue, oldValue) => {
    // 当 `source` 变化时，仅触发一次
  },
  { once: true }
)
```

4. watch vs watchEffect

watch仅跟踪明确监视的源。它不会跟踪回调中访问的任何内容。此外，回调仅在源实际发生更改时触发。将watch依赖项跟踪与副作用分开，使我们能够更精确地控制回调的触发时间。

watchEffect另一方面，将依赖项跟踪和副作用合并到一个阶段。它会自动跟踪同步执行期间访问的每个反应性属性。这更方便，通常会产生更简洁的代码，但会使其反应性依赖性不那么明确。

对于这种只有一个依赖项的例子来说，watchEffect()的好处相对较小。但是对于有多个依赖项的侦听器来说，使用watchEffect()可以消除手动维护依赖列表的负担。此外，`如果你需要侦听一个嵌套数据结构中的几个属性，watchEffect()可能会比深度侦听器更有效，因为它将只跟踪回调中被使用到的属性，而不是递归地跟踪所有的属性。`


watchEffect仅会在其同步执行期间，才追踪依赖。在使用异步回调时，只有在第一个await正常工作前访问到的属性才会被追踪。


5. 回调的触发时机
