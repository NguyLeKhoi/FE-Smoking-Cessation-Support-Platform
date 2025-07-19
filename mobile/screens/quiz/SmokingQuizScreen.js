// SmokingQuizScreen.js
// Màn hình quiz hút thuốc mobile - Updated to match web functionality

import React, { useEffect, useState, useReducer } from 'react';
import { 
  View, 
  Text, 
  Button, 
  ActivityIndicator, 
  Alert, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  SafeAreaView
} from 'react-native';
import smokingService from '../../service/smokingService';

const defaultState = {
  cigarettes_per_pack: '',
  price_per_pack: '',
  cigarettes_per_day: '',
  smoking_years: '',
  triggers: [],
  health_issues: ''
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'UPDATE_TRIGGERS':
      return {
        ...state,
        triggers: action.checked
          ? [...state.triggers, action.value]
          : state.triggers.filter((t) => t !== action.value)
      };
    case 'RESET':
      return defaultState;
    case 'INITIALIZE':
      return action.data;
    default:
      return state;
  }
};

const SmokingQuizScreen = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, dispatch] = useReducer(formReducer, defaultState);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Questions configuration
  const questions = [
    {
      id: 1,
      question: 'How many cigarettes do you smoke a day?',
      field: 'cigarettes_per_day',
      type: 'select',
      options: [
        { label: '1–5 cigarettes', value: '3' },
        { label: '6–10 cigarettes', value: '8' },
        { label: '11–15 cigarettes', value: '12' },
        { label: 'More than 15 cigarettes', value: '18' },
      ]
    },
    {
      id: 2,
      question: 'How many cigarettes are in a pack that you usually buy?',
      field: 'cigarettes_per_pack',
      type: 'select',
      options: [
        { label: '10 cigarettes (small pack)', value: '10' },
        { label: '20 cigarettes (regular pack)', value: '20' },
        { label: '25 or more cigarettes (large pack)', value: '25' },
        { label: 'I don\'t pay attention / I don\'t buy cigarettes', value: '15' }
      ]
    },
    {
      id: 3,
      question: 'What is the average price you pay for a pack of cigarettes? (in $)',
      field: 'price_per_pack',
      type: 'select',
      options: [
        { label: 'Less than $3', value: '2' },
        { label: '$3 – $5', value: '4' },
        { label: '$6 – $8', value: '7' },
        { label: 'More than $8', value: '10' }
      ]
    },
    {
      id: 4,
      question: 'How many years have you been smoking?',
      field: 'smoking_years',
      type: 'select',
      options: [
        { label: 'Less than 1 year', value: '0.5' },
        { label: '1–5 years', value: '3' },
        { label: '6–10 years', value: '8' },
        { label: 'More than 10 years', value: '15' }
      ]
    },
    {
      id: 5,
      question: 'When are you most likely to smoke? (Select all that apply)',
      field: 'triggers',
      type: 'checkbox',
      options: [
        'Stress',
        'After meals',
        'Social situations',
        'Boredom',
        'Alcohol consumption'
      ]
    },
    {
      id: 6,
      question: 'Have you experienced any health issues due to smoking? (Please describe)',
      field: 'health_issues',
      type: 'text',
      placeholder: 'For example: coughing, shortness of breath, etc. or "No health issues"'
    }
  ];

  useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {
    try {
      setLoading(true);
      const response = await smokingService.getMySmokingHabits();
      
      if (response?.data?.length > 0) {
        const sortedRecords = [...response.data].sort((a, b) => {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        });
        const latestRecord = sortedRecords[0];
        
        dispatch({
          type: 'INITIALIZE',
          data: {
            cigarettes_per_pack: latestRecord.cigarettes_per_pack,
            price_per_pack: latestRecord.price_per_pack,
            cigarettes_per_day: latestRecord.cigarettes_per_day,
            smoking_years: latestRecord.smoking_years,
            triggers: Array.isArray(latestRecord.triggers) ? latestRecord.triggers : [],
            health_issues: latestRecord.health_issues || ''
          }
        });
        
        setResult(latestRecord);
      }
    } catch (err) {
      
    } finally {
      setLoading(false);
    }
  };

  const validateCurrentField = () => {
    const currentField = questions[currentQuestion].field;

    if (currentField === 'health_issues') {
      return true; // Optional field
    }

    if (currentField === 'triggers') {
      if (!formData.triggers?.length) {
        setError('Please select at least one smoking trigger.');
        return false;
      }
      return true;
    }

    if (!formData[currentField]) {
      setError('Please select an option.');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentField()) {
      return;
    }

    setError(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => prev - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      const requiredFields = ['cigarettes_per_day', 'smoking_years', 'price_per_pack', 'cigarettes_per_pack'];
      const missingFields = requiredFields.filter(field => !formData[field]);

      if (missingFields.length > 0 || !formData.triggers?.length) {
        setError('Please fill in all required fields before submitting the assessment.');
        return;
      }

      setSubmitting(true);
      setError(null);

      const dataToSubmit = {
        cigarettes_per_pack: Number(formData.cigarettes_per_pack),
        price_per_pack: Number(formData.price_per_pack),
        cigarettes_per_day: Number(formData.cigarettes_per_day),
        smoking_years: Math.round(Number(formData.smoking_years)),
        triggers: formData.triggers,
        health_issues: formData.health_issues || 'No health issues reported'
      };

      const resultData = await smokingService.createSmokingHabit(dataToSubmit);
      
      const calculatedDailyCost = (
        (Number(dataToSubmit.cigarettes_per_day) / Number(dataToSubmit.cigarettes_per_pack)) *
        Number(dataToSubmit.price_per_pack)
      );

      // Use resultData if available, otherwise use calculated data
      const finalResult = {
        ...dataToSubmit,
        ai_feedback: resultData?.ai_feedback || 'Thank you for completing the smoking assessment. Consider the impact of smoking on your health and finances.',
        created_at: resultData?.created_at || new Date().toISOString(),
        daily_cost: resultData?.daily_cost || calculatedDailyCost,
        isUpdated: resultData?.isUpdated || false
      };

      setResult(finalResult);

    } catch (error) {
      // Show more detailed error message
      let errorMessage = 'There was an error submitting your assessment. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setError(null);
    setResult(null);
    dispatch({ type: 'RESET' });
  };

  const renderQuestion = () => {
    const q = questions[currentQuestion];
    
    if (q.type === 'select') {
      return (
        <View style={styles.optionsContainer}>
          {q.options.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                formData[q.field] === option.value && styles.selectedOption
              ]}
              onPress={() => dispatch({ type: 'UPDATE_FIELD', field: q.field, value: option.value })}
            >
              <Text style={[
                styles.optionText,
                formData[q.field] === option.value && styles.selectedOptionText
              ]}>
                {String.fromCharCode(65 + index)}. {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (q.type === 'checkbox') {
      return (
        <View style={styles.checkboxContainer}>
          {q.options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.checkboxItem}
              onPress={() => {
                const isChecked = formData.triggers.includes(option);
                dispatch({ type: 'UPDATE_TRIGGERS', value: option, checked: !isChecked });
              }}
            >
              <View style={[
                styles.customCheckbox,
                formData.triggers.includes(option) && styles.checkedCheckbox
              ]}>
                {formData.triggers.includes(option) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.checkboxLabel}>{option}</Text>
            </TouchableOpacity>
          ))}
    </View>
  );
    }

    if (q.type === 'text') {
      return (
        <TextInput
          style={styles.textInput}
          value={formData[q.field]}
          onChangeText={(text) => dispatch({ type: 'UPDATE_FIELD', field: q.field, value: text })}
          placeholder={q.placeholder}
          multiline
          numberOfLines={3}
        />
      );
    }

    return null;
  };

  const renderResult = () => {
    if (!result) return null;

    const cigarettesPerDay = Number(result.cigarettes_per_day) || 0;
    const smokingYears = Number(result.smoking_years) || 0;
    const pricePerPack = Number(result.price_per_pack) || 0;
    const cigarettesPerPack = Number(result.cigarettes_per_pack) || 0;
    
    const lifetimeCigarettes = cigarettesPerDay * 365 * smokingYears;
    const annualCost = (cigarettesPerDay / cigarettesPerPack) * pricePerPack * 365;
    const lifetimeCost = annualCost * smokingYears;
    const daysSpentSmoking = (cigarettesPerDay * 5 * 365 * smokingYears) / (60 * 24);

    return (
      <ScrollView style={styles.resultContainer}>
        <Text style={styles.resultTitle}>
          {result.isUpdated ? 'Updated Smoking Impact Assessment' : 'Your Smoking Impact Assessment'}
        </Text>
        
        {result.isUpdated && (
          <View style={styles.updateNotice}>
            <Text style={styles.updateNoticeText}>
              ✓ Your smoking profile has been updated successfully!
            </Text>
          </View>
        )}
        
        {result.ai_feedback && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackTitle}>Personalized Feedback</Text>
            <Text style={styles.feedbackText}>{result.ai_feedback}</Text>
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{Math.round(lifetimeCigarettes).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Cigarettes smoked in your lifetime</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>${Math.round(lifetimeCost).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Lifetime spending on cigarettes</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{Math.round(daysSpentSmoking)}</Text>
            <Text style={styles.statLabel}>Days spent smoking</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleRetakeQuiz}>
            <Text style={styles.buttonText}>
              {result.isUpdated ? 'Update Assessment' : 'Retake Assessment'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3f332b" />
      </SafeAreaView>
    );
  }

  if (result) {
    return (
      <SafeAreaView style={styles.container}>
        {renderResult()}
      </SafeAreaView>
    );
  }

  const q = questions[currentQuestion];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Assessing Your Smoking Habit...</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentQuestion + 1} of {questions.length}
          </Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{q.question}</Text>
          {renderQuestion()}
        </View>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <View style={styles.navigationContainer}>
          {currentQuestion > 0 && (
            <TouchableOpacity 
              style={styles.navButton} 
              onPress={handlePrevious}
              disabled={submitting}
            >
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
          
        <TouchableOpacity
            style={[styles.navButton, styles.primaryNavButton]} 
            onPress={handleNext}
            disabled={submitting}
          >
            <Text style={[styles.navButtonText, styles.primaryNavButtonText]}>
              {submitting ? 'Submitting...' : 
               currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
            </Text>
        </TouchableOpacity>
    </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#3f332b',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3f332b',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  questionContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  selectedOption: {
    borderColor: '#3f332b',
    backgroundColor: '#f5f5f5',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    fontWeight: '600',
    color: '#3f332b',
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
    flex: 1,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkedCheckbox: {
    borderColor: '#3f332b',
    backgroundColor: '#3f332b',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#e53935',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3f332b',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  primaryNavButton: {
    backgroundColor: '#3f332b',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3f332b',
  },
  primaryNavButtonText: {
    color: '#fff',
  },
  resultContainer: {
    flex: 1,
    padding: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#3f332b',
  },
  feedbackContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  statsContainer: {
    marginBottom: 30,
  },
  statItem: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3f332b',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3f332b',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3f332b',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3f332b',
  },
  primaryButtonText: {
    color: '#fff',
  },
  updateNotice: {
    backgroundColor: '#e8f5e8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#43a047',
  },
  updateNoticeText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SmokingQuizScreen; 