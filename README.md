## 为什么要写博客
主要还是因为找不到工作比较闲。正好最近学了很多东西，转行java也干了三年了，作为一个半小白还是踩了很多坑，也补了很多基础知识，是时候来个阶段性总结了，把自己所学的东西都总结一下。

## 我认为学习的几个重点
### 总结
我一直认为总结对于学习来说是一个很重要的事情。在我读大学的时候，学习理论力学，每节课我都会认真听讲，但是该听不懂还是听不懂，有时候都觉得自己是不是脑子有问题。本着期末要挂的心态，最后考试周进行了一次完备的复习，发现老师讲的是真的好。老师讲课是基于整体来讲的，所以在前面的学习中有着后面课程的思想和知识，在后面课程中也自然嵌套的前面的基础。作为一个初学者来说，没有进行系统预习，这种学习方式是很难听的懂的。但是还好我最后考试周的时候系统的复习了一遍，把所有知识串起来过了一遍，当时有一种融会贯通的感觉，后面考试也取得了理想的成绩。说这个故事主要还是因为这件事是我意识到总结的重要性。

初学一门东西是很难从全局上去考虑的，这会导致视野被局限在细节上，这种情况在我后面学习各种东西的时候都有过。包括spring源码的学习，包括算法的学习，太过纠结细节上的优化，完全不知道为什么这个地方要这样设计、考虑。

### 抽象
**总结起到的作用就是将所有细节统合起来，组成整体，而抽象就是将具体细节忽略，考虑整体。抽象在某种意义上就是总结的更抽象的概念。** 从全局来看，或者忽略细节来看待问题有很多好处，例如对于模块和接口的理解。我要设计一个简单数据库读取系统，从细节考虑就是设计MySQL数据库的链接建立，sql语句拼接执行，执行获取数据。然后以同样的流程设计Oracle数据库等等。换个角度，用抽象的思考，即忽略具体实现，我不再考虑是哪个数据库，我认为所有的数据库读取流程都应该有以下四个步骤。建立连接、sql拼接、sql执行、数据获取。那么作为我的核心模块设计就应该是考虑和维护这四个模块的流程合理性，具体的代码实现由不同的连接代码实现，这些代码就叫驱动，比如连接MySQL数据库就安装MySQL驱动，我的核心模块固定调用方式就是接口规范。

**抽象是一个很好的思维方式，你所忽略的细节越多，这个模式就能使用到更广泛的地方。但是你所忽略的越多，你要填充的细节也越多。** 抽象不能减少具体的细节。但是抽象能够提高这个解决方案的稳定性，因为不依赖细节，细节可以替换，替换的不同细节就是模块，模块和模块连接的规范就是接口。

**抽象还有个好处就是对于不懂的地方直接抽象成一个黑盒模块，这对学习整体有很大的好处，因为忽略的细节，所以不会因为被庞杂的事情影响到自己的思维。** 比如我在学习spring的时候，对于beanDefinition其实不是我当前学习的重点，我想先了解spring的三级缓存，这个时候我把所有我不知道的逻辑全部抽象成一个黑盒模块，我给这个模块一个输入，即我在类上的注解，也就是一个信息，我能够获取到一个beanDefinition，那么这一块逻辑我全部忽略，对于后面代码的研究，起到了一个抽丝剥茧的作用。包括在我学习网络传输的物理层等等，所有我暂时不想学习的逻辑，我都抽象成一个黑盒模块，具体什么时候拆开这个黑盒模块，到时候再说。