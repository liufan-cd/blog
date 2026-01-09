---
title: 👀 java使用modbus库
summary: java软件中嵌入js代码块
date: 2025-12-25
authors:
  - admin
tags:
  - java三方库
image:
  filename: "Image_1752969385133.jpg"
  focal_point: Smart
  preview_only: false
  alt_text: "随机图片"
---
## Modbus协议

### Modbus协议介绍
Modbus是由施耐德在1979年推出的**工业级串行通信协议**，也是目前工控领域最通用、最主流的通信协议之一，核心定位是「工业设备间的“通用语言”」。
- **核心特点**：
  - 开源免费：无专利限制，几乎所有工控设备（PLC、传感器、变频器、电表等）都原生支持；
  - 主从架构：协议基于“主-从”（Master-Slave）模式设计，一台主站可管理多台从站，逻辑简单；
  - 跨介质支持：可运行在串口（RS232/RS485）、以太网（TCP/IP）等物理层，其中串口（RS485）是工业现场最常用的方式；
  - 数据结构简单：仅定义了“读/写线圈、离散输入、保持寄存器、输入寄存器”4类核心数据，易于解析和实现。
- **应用场景**：工厂自动化（PLC之间通信）、楼宇自控（电表/水表采集）、物联网终端（传感器数据上报）等。

#### 通讯模型及方式
Modbus的核心是「主从通讯模型」，且针对不同物理层定义了3种主流传输方式（串口场景重点关注RTU）：

##### 1. 通讯模型（主-从模式）
- **主站（Master）**：唯一主动发起请求的设备（如电脑、工控机、网关），负责向从站发送指令（读/写数据），并接收从站响应；
- **从站（Slave）**：被动响应的设备（如PLC、传感器），每个从站有唯一的ID（1-247），仅响应指向自身ID的请求，无请求时不主动发送数据；
- **通信规则**：主站一次仅与一个从站通信，从站不会主动向主站发数据，也不会在主站未请求时回应。
---

## Modbus串口调试
### Windows
Windows下的Modbus串口调试核心是「先确认可用串口」，再用modpoll工具连接从站测试通信，步骤如下：

#### 1. 查询串口
Windows下有3种常用方式查询已连接的串口（RS232/RS485转USB）：
##### 设备管理器（可视化，最常用）
- 右键「此电脑」→「管理」→「设备管理器」→ 展开「端口（COM和LPT）」；
- 列表中显示的「COMx」（如COM3、COM4）即为可用串口，括号内会标注设备名称（如“USB-SERIAL CH340”）；

#### 2. 使用modpoll连接
modpoll是Modbus调试的轻量级命令行工具（支持Windows/Linux），专为测试Modbus RTU/TCP通信设计，步骤如下：

##### 步骤1：下载modpoll
- 官网下载：https://www.modbusdriver.com/modpoll.html（选择Windows版本，解压即可用，无需安装）；
- 解压后将`modpoll.exe`放在易访问的路径（如`C:\modpoll\`）。

##### 步骤2：打开命令行并进入modpoll目录
```bash
# 示例：进入modpoll解压目录
cd C:\modpoll
```

##### 步骤3：Modbus RTU连接测试（核心命令）
**核心语法**：
```bash
modpoll -m rtu -p [串口名] -b [波特率] -a [从站ID] -r [起始寄存器地址] -c [读取数量] [设备地址]
```
**参数说明**：
- `-m rtu`：指定通信模式为Modbus RTU；
- `-p COM3`：指定串口名（如COM3，需替换为实际端口）；
- `-b 9600`：指定波特率（需与从站一致，默认9600）；
- `-a 1`：指定从站ID（需与从站配置一致，如1）；
- `-r 0`：读取的起始寄存器地址（如0）；
- `-c 10`：读取的寄存器数量（如10）；
- 最后无额外设备地址（串口模式无需IP，TCP模式需填IP）。

**示例1：读取从站ID=1的保持寄存器（地址0开始，共10个）**
```bash
modpoll -m rtu -p COM3 -b 9600 -a 1 -r 0 -c 10
```

**示例2：写入数据到从站ID=1的保持寄存器（地址0写入数值123）**
```bash
modpoll -m rtu -p COM3 -b 9600 -a 1 -r 0 -w 123
```

### Linux
Linux下的Modbus串口调试逻辑与Windows一致，但查询串口、权限处理、modpoll安装略有不同：

#### 0. 驱动安装

对于USB转串口，高版本ubuntu是将驱动默认添加内核模块的，低版本需要自己手动安装模块。

```bash
lsmod | grep pl2303
```

安装驱动
```bash
sudo modprobe pl2303
```

#### 1. 查询串口
Linux下无可视化设备管理器，通过命令行查询串口：

##### 方式1：列出所有串口设备
```bash
# 列出所有tty串口设备（RS485/RS232转USB通常显示为ttyUSB0、ttyUSB1）
ls /dev/ttyUSB*
# 或列出所有串口（包含ttyACM等）
ls /dev/tty*
```

##### 方式2：查看串口插拔日志（确认新连接的串口）
```bash
# 查看内核日志，过滤串口相关信息（插拔设备后执行）
dmesg | grep tty
```
输出示例（识别新串口）：
```
[1234.567890] usb 1-1: ch341-uart converter now attached to ttyUSB0
```
→ 说明新连接的串口是`/dev/ttyUSB0`。

##### 方式3：查看USB串口设备信息
```bash
lsusb
```
输出中会显示串口转USB芯片（如“QinHeng Electronics CH340”），确认硬件已识别。

#### 2. 使用modpoll
##### 步骤1：处理串口权限（关键！）
Linux下普通用户默认无串口访问权限，需先授权：
```bash
# 临时授权（重启后失效）
sudo chmod 666 /dev/ttyUSB0

# 永久授权（将当前用户加入dialout组）
sudo usermod -aG dialout $USER
# 授权后需注销/重启生效
```

##### 步骤2：下载并安装modpoll
```bash
# 下载Linux版本modpoll（64位系统）
wget https://www.modbusdriver.com/downloads/modpoll-linux-x64.tar.gz

# 解压
tar -zxvf modpoll-linux-x64.tar.gz

# 进入解压目录
cd modpoll-linux-x64
```

##### 步骤3：Modbus RTU连接测试（核心命令）
Linux下语法与Windows基本一致，仅串口名改为`/dev/ttyUSB0`：

**示例1：读取从站ID=1的保持寄存器（地址0，共10个）**
```bash
./modpoll -m rtu -p /dev/ttyUSB0 -b 9600 -a 1 -r 0 -c 10
```

**示例2：写入数值到从站ID=1的寄存器（地址0写入456）**
```bash
./modpoll -m rtu -p /dev/ttyUSB0 -b 9600 -a 1 -r 0 -w 456
```
---

## Modbus 传输速率
Modbus串口通信（RTU/ASCII）的“传输速率”核心是**波特率（Baud Rate）**，即串口每秒传输的二进制位数（bit/s）。但需明确两个关键概念：
- **标称波特率**：配置的理论值（如9600、115200），代表串口物理层的传输能力；
- **实际有效速率**：扣除帧开销（起始位、停止位、校验位、Modbus帧间隔/CRC）后，真正能传输的Modbus有效数据速率，这是工业现场的核心参考指标。

Modbus RTU是串口场景的主流（占99%以上），且默认采用「8N1」帧格式（8位数据位、无校验位、1位停止位），以下分析均基于此格式展开。

### 理论9600和115200传输速率
#### 1. 基础帧结构计算（8N1格式）
串口传输1个字节（8位）的数据，需要额外携带「1位起始位 + 1位停止位」，即**每传输1个有效字节，需占用10位物理带宽**（这是理论计算的核心前提）。

| 计算维度                | 9600波特率                          | 115200波特率                        |
|-------------------------|-------------------------------------|-------------------------------------|
| 标称总比特率            | 9600 bit/s                          | 115200 bit/s                        |
| 每秒可传输的字节数 | 9600 ÷ 10 = 960 字节/秒（B/s）      | 115200 ÷ 10 = 11520 字节/秒（B/s）  |
| 每秒可传输的千字节数    | 960 ÷ 1024 ≈ 0.94 KB/s              | 11520 ÷ 1024 ≈ 11.25 KB/s            |

#### 2. Modbus RTU帧额外开销修正
上述计算仅考虑串口字节传输开销，Modbus RTU帧还包含「帧间隔（3.5个字符时间）+ 地址位 + 功能码 + CRC校验」，需进一步修正理论有效速率：
- 字符时间：1个字符（字节）的传输时间 = 10 ÷ 波特率（秒）；
  - 9600波特率：1字符时间 ≈ 1.0417 ms；
  - 115200波特率：1字符时间 ≈ 0.0868 ms；
- 帧间隔：Modbus RTU要求帧间间隔≥3.5个字符时间（用于区分不同帧），单次通信（请求+响应）需额外消耗约7个字符时间（请求帧间隔+响应帧间隔）；
- 典型帧开销：以“读10个保持寄存器”为例（最常用场景）：
  - 请求帧：8字节（地址1 + 功能码1 + 起始地址2 + 寄存器数2 + CRC2）；
  - 响应帧：25字节（地址1 + 功能码1 + 字节数1 + 数据20 + CRC2）；
  - 总传输字节：8+25=33字节，额外帧间隔开销≈7字符时间。

**修正后理论有效速率**：
- 9600波特率：≈ 850 ~ 900 B/s（比纯字节传输低5~10%）；
- 115200波特率：≈ 10500 ~ 11000 B/s（比纯字节传输低5~10%）。

### 实际传输速率
以下是基于「Linux服务器 + 物理Modbus RTU从站」的实测数据。

#### 1. 测试环境准备
| 组件                | 规格说明                                  |
|---------------------|-------------------------------------------|
| Linux服务器         | 22.04.1-Ubuntu |
| 9600 Modbus从站     | 300X 系列模拟量采集模块            |
| 115200 Modbus从站   | USB-5000 系列多功能数据采集卡        |
| 总线环境            | RS485屏蔽线，长度20米，无其他干扰设备         |
| 测试工具            | modbus4j         |

#### 2. 测试步骤

使用modbus4j循环访问从站，并统计一分钟访问次数



#### 3. 长距离场景补充测试（100米总线）
|Modbus从站| 波特率   | 实际有效速率 | 
|--|----------|------------|
|300X 系列模拟量采集模块| 9600     | 10 次/s  |
|USB-5000 系列多功能数据采集卡| 115200   | 16 次/s  |

![测试结果图片](../image.png)

---

## Modbus4j
Modbus4j 是一个 开源、轻量级的 Java 类库（基于 Apache 2.0 开源协议），专门用于简化 Java 程序与支持 Modbus 协议的设备 / 系统之间的通信开发，无需开发者手动实现 Modbus 协议的底层报文封装、解析和传输逻辑。

[github仓库地址](https://github.com/MangoAutomation/modbus4j)

### Maven依赖
```xml
<!-- modbus for java 依赖仓库，由于不是在共有maven仓库，需要自己手动指定或者下载添加到idea依赖中 -->
<repositories>
    <repository>
        <releases>
            <enabled>true</enabled>
        </releases>
        <snapshots>
            <enabled>false</enabled>
        </snapshots>
        <id>ias-releases</id>
        <name>Infinite Automation Release Repository</name>
        <url>https://maven.mangoautomation.net/repository/ias-release/</url>
    </repository>
</repositories>
<!-- modbus for java 依赖 -->
<dependency>
    <groupId>com.infiniteautomation</groupId>
    <artifactId>modbus4j</artifactId>
    <version>3.0.3</version>
</dependency>
<!-- 串口依赖 -->
<dependency>
    <groupId>org.scream3r</groupId>
    <artifactId>jssc</artifactId>
    <version>2.8.0</version>
</dependency>
```
### 代码示例
```java
/**
 * 查询所有串口
 */
SerialPortList.getPortNames();

/**
 * 创建Modbus RTU主站
 */
private static ModbusMaster createRtuMaster() {
    String commPortId = "COM7";
    int baudRate = 115200;
    int flowControlIn = 0;
    int flowControlOut = 0;
    int dataBits = 8;
    int stopBits = 1;
    int parity = 0;

    SerialPortWrapperImpl wrapper = new SerialPortWrapperImpl(commPortId, baudRate, flowControlIn, flowControlOut, dataBits, stopBits, parity);

    ModbusFactory modbusFactory = new ModbusFactory();
    ModbusMaster master = modbusFactory.createRtuMaster(wrapper);

    try {
        master.init(); // 初始化连接（打开串口）
        System.out.println("Modbus RTU主站初始化成功");
        return master;
    } catch (ModbusInitException e) {
        System.err.println("主站初始化失败：" + e.getMessage());
        e.printStackTrace();
        return null;
    }
}

/**
 * 读取
 */
private static void readHoldingRegister(ModbusMaster master, int startOffset, int numberOfRegisters) {
    if (master == null) return;

    try {
        // 构建读保持寄存器请求：从站ID、起始地址、寄存器数量
        ReadHoldingRegistersRequest request = new ReadHoldingRegistersRequest(SLAVE_ID, startOffset, numberOfRegisters);
        ReadHoldingRegistersResponse response = (ReadHoldingRegistersResponse) master.send(request);

        if (response.isException()) {
            System.err.println("读取失败：异常码=" + response.getExceptionCode());
        } else {
            byte[] data = response.getData();
            // todo parse data
        }
    } catch (ModbusTransportException e) {
        System.err.println("读取寄存器异常：" + e.getMessage());
        e.printStackTrace();
    }
}

/**
 * 写入
 */
private static void writeHoldingRegister(ModbusMaster master, int offset, int value) {
    if (master == null) return;

    try {
        // 构建写单个寄存器请求：从站ID、寄存器地址、写入值
        WriteRegisterRequest request = new WriteRegisterRequest(SLAVE_ID, offset, value);
        WriteRegisterResponse response = (WriteRegisterResponse) master.send(request);

        if (response.isException()) {
            System.err.println("写入失败：异常码=" + response.getExceptionCode());
        } else {
            System.out.println("写入保持寄存器(地址0)值1234成功");
        }
    } catch (ModbusTransportException e) {
        System.err.println("写入寄存器异常：" + e.getMessage());
        e.printStackTrace();
    }
}

```
> 串口输入流
```java
/**
 * Class that wraps a {@link SerialPort} to provide {@link InputStream}
 * functionality. This stream also provides support for performing blocking
 * reads with timeouts.
 * <br>
 * It is instantiated by passing the constructor a {@link SerialPort} instance.
 * Do not create multiple streams for the same serial port unless you implement
 * your own synchronization.
 *
 * @author Charles Hache <chalz@member.fsf.org>
 *
 * Attribution: https://github.com/therealchalz/java-simple-serial-connector
 *
 */
public class SerialInputStream extends InputStream {
    private SerialPort serialPort;
    private int defaultTimeout = 0;

    /**
     * Instantiates a SerialInputStream for the given {@link SerialPort} Do not
     * create multiple streams for the same serial port unless you implement
     * your own synchronization.
     *
     * @param sp The serial port to stream.
     */
    public SerialInputStream(SerialPort sp) {
        serialPort = sp;
    }

    /**
     * Set the default timeout (ms) of this SerialInputStream. This affects
     * subsequent calls to {@link #read()}, {@link #(int[])}, and
     * {@link #(int[], int, int)} The default timeout can be 'unset'
     * by setting it to 0.
     *
     * @param time The timeout in milliseconds.
     */
    public void setTimeout(int time) {
        defaultTimeout = time;
    }

    /**
     * Reads the next byte from the port. If the timeout of this stream has been
     * set, then this method blocks until data is available or until the timeout
     * has been hit. If the timeout is not set or has been set to 0, then this
     * method blocks indefinitely.
     */
    @Override
    public int read() throws IOException {
        return read(defaultTimeout);
    }

    /**
     * The same contract as {@link #read()}, except overrides this stream's
     * default timeout with the given timeout in milliseconds.
     *
     * @param timeout The timeout in milliseconds.
     * @return The read byte.
     * @throws IOException On serial port error or timeout
     */
    public int read(int timeout) throws IOException {
        byte[] buf = new byte[1];
        try {
            if (timeout > 0) {
                buf = serialPort.readBytes(1, timeout);
            } else {
                buf = serialPort.readBytes(1);
            }
            return buf[0];
        } catch (Exception e) {
            throw new IOException(e);
        }
    }

    /**
     * Non-blocking read of up to buf.length bytes from the stream. This call
     * behaves as read(buf, 0, buf.length) would.
     *
     * @param buf The buffer to fill.
     * @return The number of bytes read, which can be 0.
     * @throws IOException on error.
     */
    @Override
    public int read(byte[] buf) throws IOException {
        return read(buf, 0, buf.length);
    }

    /**
     * Non-blocking read of up to length bytes from the stream. This method
     * returns what is immediately available in the input buffer.
     *
     * @param buf The buffer to fill.
     * @param offset The offset into the buffer to start copying data.
     * @param length The maximum number of bytes to read.
     * @return The actual number of bytes read, which can be 0.
     * @throws IOException on error.
     */
    @Override
    public int read(byte[] buf, int offset, int length) throws IOException {

        if (buf.length < offset + length) {
            length = buf.length - offset;
        }

        int available = this.available();

        if (available > length) {
            available = length;
        }

        try {
            byte[] readBuf = serialPort.readBytes(available);
//            System.arraycopy(readBuf, 0, buf, offset, length);
            System.arraycopy(readBuf, 0, buf, offset, readBuf.length);
            return readBuf.length;
        } catch (Exception e) {
            throw new IOException(e);
        }
    }

    /**
     * Blocks until buf.length bytes are read, an error occurs, or the default
     * timeout is hit (if specified). This behaves as blockingRead(buf, 0,
     * buf.length) would.
     *
     * @param buf The buffer to fill with data.
     * @return The number of bytes read.
     * @throws IOException On error or timeout.
     */
    public int blockingRead(byte[] buf) throws IOException {
        return blockingRead(buf, 0, buf.length, defaultTimeout);
    }

    /**
     * The same contract as {@link #blockingRead(byte[])} except overrides this
     * stream's default timeout with the given one.
     *
     * @param buf The buffer to fill.
     * @param timeout The timeout in milliseconds.
     * @return The number of bytes read.
     * @throws IOException On error or timeout.
     */
    public int blockingRead(byte[] buf, int timeout) throws IOException {
        return blockingRead(buf, 0, buf.length, timeout);
    }

    /**
     * Blocks until length bytes are read, an error occurs, or the default
     * timeout is hit (if specified). Saves the data into the given buffer at
     * the specified offset. If the stream's timeout is not set, behaves as
     * {@link #read(byte[], int, int)} would.
     *
     * @param buf The buffer to fill.
     * @param offset The offset in buffer to save the data.
     * @param length The number of bytes to read.
     * @return the number of bytes read.
     * @throws IOException on error or timeout.
     */
    public int blockingRead(byte[] buf, int offset, int length) throws IOException {
        return blockingRead(buf, offset, length, defaultTimeout);
    }

    /**
     * The same contract as {@link #blockingRead(byte[], int, int)} except
     * overrides this stream's default timeout with the given one.
     *
     * @param buf The buffer to fill.
     * @param offset Offset in the buffer to start saving data.
     * @param length The number of bytes to read.
     * @param timeout The timeout in milliseconds.
     * @return The number of bytes read.
     * @throws IOException On error or timeout.
     */
    public int blockingRead(byte[] buf, int offset, int length, int timeout) throws IOException {
        if (buf.length < offset + length) {
            throw new IOException("Not enough buffer space for serial data");
        }

        if (timeout < 1) {
            return read(buf, offset, length);
        }

        try {
            byte[] readBuf = serialPort.readBytes(length, timeout);
            System.arraycopy(readBuf, 0, buf, offset, length);
            return readBuf.length;
        } catch (Exception e) {
            throw new IOException(e);
        }
    }

    @Override
    public int available() throws IOException {
        int ret;
        try {
            ret = serialPort.getInputBufferBytesCount();
            if (ret >= 0) {
                return ret;
            }
            throw new IOException("Error checking available bytes from the serial port.");
        } catch (Exception e) {
            throw new IOException("Error checking available bytes from the serial port.");
        }
    }
}
```
> 串口输出流
```java
/**
 * Class that wraps a {@link SerialPort} to provide {@link OutputStream}
 * functionality.
 * <br>
 * It is instantiated by passing the constructor a {@link SerialPort} instance.
 * Do not create multiple streams for the same serial port unless you implement
 * your own synchronization.
 *
 * @author Charles Hache <chalz@member.fsf.org>
 *
 * Attribution: https://github.com/therealchalz/java-simple-serial-connector
 *
 */
public class SerialOutputStream extends OutputStream {

    SerialPort serialPort;

    /**
     * Instantiates a SerialOutputStream for the given {@link SerialPort} Do not
     * create multiple streams for the same serial port unless you implement
     * your own synchronization.
     *
     * @param sp The serial port to stream.
     */
    public SerialOutputStream(SerialPort sp) {
        serialPort = sp;
    }

    @Override
    public void write(int b) throws IOException {
        try {
            serialPort.writeInt(b);
        } catch (SerialPortException e) {
            throw new IOException(e);
        }
    }

    @Override
    public void write(byte[] b) throws IOException {
        write(b, 0, b.length);

    }

    @Override
    public void write(byte[] b, int off, int len) throws IOException {
        byte[] buffer = new byte[len];
        System.arraycopy(b, off, buffer, 0, len);
        try {
            serialPort.writeBytes(buffer);
        } catch (SerialPortException e) {
            throw new IOException(e);
        }
    }
}
```