// SmokingQuizScreen.js
// Màn hình quiz hút thuốc mobile

import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import smokingService from '../../service/smokingService';

const SmokingQuizScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await smokingService.getQuizQuestions();
      setQuestions(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải câu hỏi quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[current] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[current] == null) {
      Alert.alert('Vui lòng chọn đáp án!');
      return;
    }
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const res = await smokingService.submitQuiz({ answers });
      setResult(res);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi kết quả quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (result) return (
    <View style={styles.container}>
      <Text style={styles.title}>Kết quả Quiz</Text>
      <Text style={styles.result}>{result.result || JSON.stringify(result)}</Text>
      <Button title="Làm lại" onPress={() => { setResult(null); setCurrent(0); setAnswers([]); }} />
    </View>
  );
  if (!questions.length) return <Text>Không có câu hỏi quiz</Text>;

  const q = questions[current];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz thói quen hút thuốc</Text>
      <Text style={styles.question}>{q.question}</Text>
      {q.options && q.options.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.option, answers[current] === idx && styles.selected]}
          onPress={() => handleAnswer(idx)}
        >
          <Text>{opt}</Text>
        </TouchableOpacity>
      ))}
      <Button title={current === questions.length - 1 ? 'Nộp bài' : 'Tiếp theo'} onPress={handleNext} disabled={submitting} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  question: { fontSize: 18, marginBottom: 16 },
  option: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selected: {
    backgroundColor: '#cce5ff',
    borderColor: '#007AFF',
  },
  result: { fontSize: 18, color: '#007AFF', marginBottom: 24, textAlign: 'center' },
});

export default SmokingQuizScreen; 