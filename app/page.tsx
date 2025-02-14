"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Button, Input, Card, Typography, Space } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DownloadOutlined,
  LeftOutlined,
  ReloadOutlined,
  RightOutlined,
  RocketOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { PieChart, Pie, Cell } from "recharts";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay, Navigation } from "swiper/modules";

import data from "./data.json";

const { Title, Text } = Typography;

const SCORES_MAP: Record<string, number> = {
  Có: 1,
  "Không rõ": 0.5,
  Không: 0,
};

const INITIAL_FLAGS = {
  ready: false,
  start: false,
  share: false,
  shareEmail: false,
};

const INITIAL_ANSWERS = Array(data.questions.length).fill(null);

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [answers, setAnswers] = useState<(string | null)[]>(INITIAL_ANSWERS);
  const [step, setStep] = useState<number>(0);
  const [score, setScore] = useState<number | null>(null);
  const [flags, setFlags] = useState(INITIAL_FLAGS);
  const [result, setResult] = useState<any>(null);

  const handleAnswer = (index: number, value: string) => {
    setAnswers((prev) => prev.map((ans, i) => (i === index ? value : ans)));
  };

  const calculateScore = () => {
    const totalScore = answers.reduce(
      (sum, ans) => sum + (SCORES_MAP[ans || "Không"] || 0),
      0
    );
    setScore(totalScore);

    const matchedResult = data.results.find(
      (result) => totalScore >= result.range[0] && totalScore < result.range[1]
    );

    setResult(matchedResult);
  };

  const images = ["/1.jpg", "/2.PNG", "/3.PNG", "/4.PNG", "/5.PNG"];

  const gaugePercent = Math.min(Math.max(score ? score / 10 : 0, 0), 1);

  const styles = useMemo(
    () => ({
      centerContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      },
      cardTransparent: {
        maxWidth: 500,
        textAlign: "center" as const,
        backgroundColor: "transparent",
        border: "none",
        color: "white",
      },
      input: {
        marginTop: 20,
        padding: "10px",
        borderRadius: 8,
      },
      buttonPrimary: {
        marginTop: 12,
        background: "#0052CC",
        borderRadius: 8,
        fontSize: 16,
        fontWeight: "bold",
        height: 48,
      },
    }),
    []
  );

  const Carousel = () => {
    return (
      <div className="relative max-w-3xl mx-auto">
        <Swiper
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          speed={1000}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[Autoplay, Navigation]}
          className="rounded-2xl shadow-xl"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index} className="relative group">
              <Image
                src={src}
                alt={`Ảnh ${index + 1}`}
                width={800}
                height={400}
                className="rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="swiper-button-prev absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white rounded-full hover:bg-black/60 transition">
          <LeftOutlined style={{ fontSize: "18px" }} />
        </button>
        <button className="swiper-button-next absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white rounded-full hover:bg-black/60 transition">
          <RightOutlined style={{ fontSize: "18px" }} />
        </button>
      </div>
    );
  };

  const GaugeChart = ({ percent }: { percent: number }) => {
    const score = (percent * 10).toFixed(1);
    const data = [{ value: percent }, { value: 1 - percent }];
    const COLORS = ["#2FA3FF", "#E0E0E0"];

    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 120,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PieChart width={200} height={120}>
          <Pie
            data={data}
            cx={100}
            cy={100}
            startAngle={180}
            endAngle={0}
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </div>
    );
  };

  const renderWelcomeScreen = () => {
    const handleStart = () => {
      setFlags((prevState) => ({ ...prevState, ready: true }));
    };

    return (
      <div>
        <div style={{ marginBottom: 30, textAlign: "center" }}>
          <Text style={{ color: "#9DBAE2", textTransform: "uppercase" }}>
            Đánh giá mức độ trưởng thành <br />
            về quản trị trải nghiệm khách hàng
          </Text>
        </div>
        <Carousel />
        <div style={styles.centerContainer}>
          <Card style={styles.cardTransparent}>
            <Title level={1} style={{ color: "white", marginTop: 16 }}>
              Công ty bạn trưởng thành như thế nào trong việc lắng nghe khách
              hàng?
            </Title>
            <Text style={{ color: "#9DBAE2", fontSize: 16 }}>
              Đánh giá khả năng của bạn trong việc lắng nghe, hiểu và đáp ứng
              các tín hiệu từ khách hàng.
            </Text>
            <Input
              placeholder="Địa chỉ email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <Button
              type="primary"
              block
              style={styles.buttonPrimary}
              icon={<RocketOutlined />}
              onClick={handleStart}
            >
              Bắt đầu
            </Button>
          </Card>
        </div>
      </div>
    );
  };

  const renderInstructionScreen = () => (
    <div style={{ ...styles.centerContainer, flexDirection: "column" }}>
      <div style={{ textAlign: "center", color: "white", marginBottom: 60 }}>
        <Text style={{ color: "#9DBAE2", textTransform: "uppercase" }}>
          Đánh giá mức độ trưởng thành <br />
          về quản trị trải nghiệm khách hàng
        </Text>
      </div>
      <Card
        style={{
          maxWidth: 500,
          backgroundColor: "#384e6b",
          backdropFilter: "blur(10px)",
          borderRadius: 12,
          padding: "20px",
          textAlign: "left",
          border: "none",
          color: "white",
        }}
      >
        <Text
          strong
          style={{
            color: "#ffffff",
            display: "block",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          <span style={{ color: "#2FA3FF" }}>●</span> HƯỚNG DẪN TRẢ LỜI
        </Text>
        <Title level={4} style={{ color: "#ffffff" }}>
          Hãy dựa vào hướng dẫn sau đây để trả lời các câu hỏi:
        </Title>
        <ul
          style={{
            paddingLeft: 20,
            color: "#ffffff",
            fontSize: 16,
            listStyle: "disc",
          }}
        >
          <li>
            <Text style={{ color: "#ffffff" }}>
              <strong>Chọn "Có":</strong> nếu câu đó phản ánh hiện trạng đang có{" "}
              <br />
              <em>VÀ</em> được thực hiện một cách nhất quán (ít nhất 80% thời
              gian)
            </Text>
          </li>
          <li>
            <Text style={{ color: "#ffffff" }}>
              <strong>Chọn "Không có":</strong> nếu hoàn toàn chưa từng thực
              hiện
            </Text>
          </li>
          <li>
            <Text style={{ color: "#ffffff" }}>
              <strong>Chọn "Không rõ về vấn đề này":</strong> nếu không chắc
              chắn đã thực hiện hay chưa
            </Text>
          </li>
        </ul>
        <Button
          type="primary"
          block
          style={{
            marginTop: 20,
            background: "#0052CC",
            borderRadius: 8,
            fontSize: 16,
            fontWeight: "bold",
            height: 48,
          }}
          onClick={() => {
            setFlags((prevState) => ({ ...prevState, start: true }));
            setStep((prev) => prev + 1);
          }}
        >
          Bắt đầu →
        </Button>
      </Card>
    </div>
  );

  const renderQuestionScreen = () => {
    const currentQuestion = data.questions[step - 1];

    return (
      <div style={{ ...styles.centerContainer, flexDirection: "column" }}>
        <div style={{ textAlign: "center", color: "white", marginBottom: 70 }}>
          <Text style={{ color: "#9DBAE2", textTransform: "uppercase" }}>
            Đánh giá mức độ trưởng thành <br />
            về quản trị trải nghiệm khách hàng
          </Text>
        </div>
        <Card
          style={{
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 12,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
          }}
        >
          <Title
            level={5}
            style={{ color: "#9DBAE2", textTransform: "uppercase" }}
          >
            • Câu hỏi {step}/{data.questions.length}
          </Title>
          <Text style={{ color: "#ffffff", fontSize: 16 }}>
            {currentQuestion.title}
          </Text>
          <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", marginTop: 20 }}
          >
            {currentQuestion.options.map((option) => (
              <Button
                key={option.id}
                block
                size="large"
                onClick={() => {
                  handleAnswer(step - 1, option.text);
                  setStep((prev) => prev + 1);
                }}
                style={{
                  background: "transparent",
                  border: "1px solid #ffffff",
                  color: "#ffffff",
                  fontSize: 16,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#0056b3";
                  e.currentTarget.style.borderColor = "#0056b3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.borderColor = "#ffffff";
                }}
              >
                {option.text}
              </Button>
            ))}
          </Space>
          <Space
            style={{
              marginTop: 20,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Button
              icon={<ArrowLeftOutlined />}
              style={{ background: "#ffffff", color: "#002855" }}
              onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
              disabled={step === 1}
            >
              Quay lại
            </Button>
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              style={{ background: "#0066ff", borderColor: "#0066ff" }}
              onClick={() =>
                setStep((prev) => Math.min(prev + 1, data.questions.length))
              }
              disabled={step === data.questions.length}
            >
              Tiếp theo
            </Button>
          </Space>
        </Card>
      </div>
    );
  };

  const renderResultsScreen = () => (
    <div style={{ ...styles.centerContainer, flexDirection: "column" }}>
      <div style={{ textAlign: "center", color: "white", marginBottom: 20 }}>
        <Text style={{ color: "#9DBAE2", textTransform: "uppercase" }}>
          Đánh giá mức độ trưởng thành <br />
          về quản trị trải nghiệm khách hàng
        </Text>
      </div>
      <Card
        style={{
          maxWidth: 400,
          backgroundColor: "#384e6b",
          backdropFilter: "blur(10px)",
          borderRadius: 12,
          padding: "20px",
          textAlign: "left",
          border: "none",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: 3,
              borderRadius: 9999,
              height: 50,
              width: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Image src={result.icon} alt="icon" height={30} width={30} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Text
              strong
              style={{
                color: "#ffffff",
                display: "block",
              }}
            >
              VOICE OF THE CUSTOMER - CẤP ĐỘ {result.level}
            </Text>

            <Title
              level={4}
              style={{
                color: "#ffffff",
                margin: 0,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {result.name}
            </Title>
          </div>
        </div>
        <Text style={{ color: "#ffffff" }}>
          Quản trị năng lực Lắng nghe khách hàng đã hình thành và đem lại hiệu
          quả. Dữ liệu phản hồi từ khách hàng được thu thập trong nhiều giai
          đoạn của hành trình khách hàng.
        </Text>
        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <GaugeChart percent={gaugePercent} />
          <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "bold" }}>
            {score}
          </Text>
        </div>
        <div
          style={{
            position: "absolute",
            top: 10,
            right: -50,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <Button
            shape="circle"
            icon={<ShareAltOutlined />}
            onClick={() =>
              setFlags((prevState) => ({ ...prevState, share: true }))
            }
          />
          <Button
            shape="circle"
            icon={<DownloadOutlined />}
            onClick={() => console.log("Download")}
          />
          <Button
            shape="circle"
            icon={<ReloadOutlined />}
            onClick={() => console.log("Reload")}
          />
        </div>
      </Card>
    </div>
  );

  const renderShareOptions = () => (
    <div style={styles.centerContainer}>
      <Card
        style={{
          maxWidth: 450,
          backgroundColor: "#ffffff",
          backdropFilter: "blur(10px)",
          borderRadius: 12,
          textAlign: "left",
          border: "none",
          color: "#000000",
          position: "relative",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Text
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: 20,
              color: "#000000",
            }}
          >
            Chia sẻ kết quả
          </Text>
        </div>
        <Text style={{ color: "#000000" }}>
          Đây là một số cách bạn có thể chia sẻ với bạn bè và đồng nghiệp của
          mình:
        </Text>
        <Card
          style={{
            borderRadius: 12,
            padding: "10px",
            textAlign: "left",
            border: "none",
            position: "relative",
          }}
        >
          <Button
            type="primary"
            block
            size="large"
            style={{
              background: "#1890ff",
              borderRadius: 8,
              marginBottom: 10,
              color: "#c4e2ff",
              fontWeight: "bold",
            }}
          >
            Chia sẻ qua Facebook
          </Button>
          <Button
            block
            size="large"
            style={{
              background: "#e9f4ff",
              borderColor: "#e9f4ff",
              marginBottom: 10,
              color: "#45a6ff",
              fontWeight: "bold",
            }}
            onClick={() =>
              setFlags((prevState) => ({ ...prevState, shareEmail: true }))
            }
          >
            Chia sẻ qua Email
          </Button>
          <Button
            block
            size="large"
            style={{
              background: "#e9f4ff",
              borderColor: "#e9f4ff",
              marginBottom: 10,
              color: "#45a6ff",
              fontWeight: "bold",
            }}
          >
            Sao chép đường dẫn đến trang kết quả
          </Button>
          <Button
            type="text"
            block
            style={{ color: "#45a6ff", fontWeight: "bold" }}
          >
            Hủy
          </Button>
        </Card>
      </Card>
    </div>
  );

  const renderShareEmail = () => (
    <div style={styles.centerContainer}>
      <Card
        style={{
          maxWidth: 400,
          backgroundColor: "#ffffff",
          borderRadius: 12,
          border: "none",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Text
          style={{
            color: "#000000",
            fontWeight: "bold",
            fontSize: 18,
            textAlign: "center",
            display: "block",
          }}
        >
          Chia sẻ qua email
        </Text>
        <div style={{ marginTop: 10, marginBottom: 20 }}>
          <Text style={{ color: "#4A4A4A" }}>
            Vui lòng cung cấp địa chỉ email mà bạn muốn chia sẻ kết quả:
          </Text>
        </div>
        <Input
          placeholder="Địa chỉ email nhận kết quả"
          style={{ height: 40, borderRadius: 8, marginBottom: 5 }}
        />
        <Text style={{ color: "#A0A0A0", fontSize: 12 }}>
          Ấn enter sau mỗi email để xác nhận
        </Text>
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <Button
            style={{
              flex: 1,
              background: "#E9F4FF",
              borderColor: "#E9F4FF",
              color: "#1890FF",
              fontWeight: "bold",
            }}
          >
            Quay lại
          </Button>
          <Button
            type="primary"
            style={{
              flex: 1,
              background: "#1890FF",
              borderRadius: 8,
              fontWeight: "bold",
            }}
          >
            Gửi email
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div
      style={{
        padding: "24px",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #001529, #000)",
      }}
    >
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        {!flags.ready && !flags.start && renderWelcomeScreen()}
        {flags.ready && !flags.start && renderInstructionScreen()}
        {flags.start &&
          flags.ready &&
          step > 0 &&
          step <= data.questions.length &&
          renderQuestionScreen()}
        {step > data.questions.length && score === null && (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <Button
              type="primary"
              onClick={calculateScore}
              style={{
                background: "linear-gradient(45deg, #2FA3FF, #007BFF)",
                border: "none",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
                padding: "12px 20px",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 123, 255, 0.3)",
                transition: "all 0.3s ease",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Xem kết quả
            </Button>
          </div>
        )}
        {score !== null && !flags.share && renderResultsScreen()}
        {flags.share && !flags.shareEmail && renderShareOptions()}
        {flags.shareEmail && renderShareEmail()}
      </Space>
    </div>
  );
}
