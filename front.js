const ComponentFunction = function() {
  // @section:imports @depends:[]
  const React = require('react');
  const { useState, useEffect, useContext, useMemo, useCallback } = React;
  const { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Platform, StatusBar, ActivityIndicator, KeyboardAvoidingView, FlatList, Image } = require('react-native');
  const { MaterialIcons } = require('@expo/vector-icons');
  const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs');
  const { useQuery, useMutation } = require('platform-hooks');
  // @end:imports

  // @section:theme @depends:[]
  const storageStrategy = 'all-local';
  const primaryColor = '#2E86AB';
  const accentColor = '#1E6091';
  const backgroundColor = '#F8FAFC';
  const cardColor = '#FFFFFF';
  const textPrimary = '#1F2937';
  const textSecondary = '#6B7280';
  const designStyle = 'modern';
  
  const Tab = createBottomTabNavigator();
  // @end:theme

  // @section:navigation-setup @depends:[]
  const tabConfig = {
    screenOptions: {
      headerShown: false,
      tabBarActiveTintColor: primaryColor,
      tabBarInactiveTintColor: textSecondary,
      tabBarStyle: { 
        position: 'absolute',
        bottom: 0,
        backgroundColor: cardColor,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        height: Platform.OS === 'web' ? 70 : 85,
        paddingBottom: Platform.OS === 'web' ? 10 : 25
      }
    }
  };
  // @end:navigation-setup

  // @section:ThemeContext @depends:[theme]
  const ThemeContext = React.createContext();
  const ThemeProvider = function(props) {
    const darkModeState = useState(false);
    const darkMode = darkModeState[0];
    const setDarkMode = darkModeState[1];
    
    const lightTheme = useMemo(function() {
      return {
        colors: {
          primary: primaryColor,
          accent: accentColor,
          background: backgroundColor,
          card: cardColor,
          textPrimary: textPrimary,
          textSecondary: textSecondary,
          border: '#E5E7EB',
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B',
          highPriority: '#EF4444',
          mediumHighPriority: '#F59E0B',
          mediumPriority: '#10B981',
          lowPriority: '#3B82F6'
        }
      };
    }, []);
    
    const darkTheme = useMemo(function() {
      return {
        colors: {
          primary: primaryColor,
          accent: accentColor,
          background: '#1F2937',
          card: '#374151',
          textPrimary: '#F9FAFB',
          textSecondary: '#D1D5DB',
          border: '#4B5563',
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B',
          highPriority: '#EF4444',
          mediumHighPriority: '#F59E0B',
          mediumPriority: '#10B981',
          lowPriority: '#3B82F6'
        }
      };
    }, []);
    
    const theme = darkMode ? darkTheme : lightTheme;
    
    const toggleDarkMode = useCallback(function() {
      setDarkMode(function(prev) { return !prev; });
    }, []);
    
    const value = useMemo(function() {
      return { 
        theme: theme, 
        darkMode: darkMode, 
        toggleDarkMode: toggleDarkMode, 
        designStyle: designStyle 
      };
    }, [theme, darkMode, toggleDarkMode]);
    
    return React.createElement(ThemeContext.Provider, { value: value }, props.children);
  };
  
  const useTheme = function() { 
    return useContext(ThemeContext); 
  };
  // @end:ThemeContext

  // @section:LoginScreen-state @depends:[ThemeContext]
  const useLoginState = function() {
    const themeContext = useTheme();
    const theme = themeContext.theme;
    const usernameState = useState('');
    const username = usernameState[0];
    const setUsername = usernameState[1];
    const passwordState = useState('');
    const password = passwordState[0];
    const setPassword = passwordState[1];
    const isLoggedInState = useState(false);
    const isLoggedIn = isLoggedInState[0];
    const setIsLoggedIn = isLoggedInState[1];
    const loadingState = useState(false);
    const loading = loadingState[0];
    const setLoading = loadingState[1];
    
    return {
      theme: theme,
      username: username,
      setUsername: setUsername,
      password: password,
      setPassword: setPassword,
      isLoggedIn: isLoggedIn,
      setIsLoggedIn: setIsLoggedIn,
      loading: loading,
      setLoading: setLoading
    };
  };
  // @end:LoginScreen-state

  // @section:LoginScreen-handlers @depends:[LoginScreen-state]
  const loginHandlers = {
    handleLogin: function(state) {
      if (!state.username.trim() || !state.password.trim()) {
        Platform.OS === 'web' ? window.alert('Please fill in all fields') : Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      
      state.setLoading(true);
      setTimeout(function() {
        state.setLoading(false);
        state.setIsLoggedIn(true);
      }, 1000);
    }
  };
  // @end:LoginScreen-handlers

  // @section:LoginScreen @depends:[LoginScreen-state,LoginScreen-handlers,styles]
  const LoginScreen = function() {
    const state = useLoginState();
    const handlers = loginHandlers;
    
    if (state.isLoggedIn) {
      return React.createElement(HomeScreen);
    }
    
    if (state.loading) {
      return React.createElement(View, { 
        style: [styles.container, { backgroundColor: state.theme.colors.background, justifyContent: 'center', alignItems: 'center' }],
        componentId: 'login-loading'
      },
        React.createElement(ActivityIndicator, { 
          size: 'large', 
          color: state.theme.colors.primary,
          componentId: 'loading'
        })
      );
    }
    
    return React.createElement(KeyboardAvoidingView, {
      style: [styles.container, { backgroundColor: state.theme.colors.background }],
      behavior: Platform.OS === 'ios' ? 'padding' : (Platform.OS === 'web' ? undefined : 'height'),
      componentId: 'login-keyboard-avoiding'
    },
      React.createElement(ScrollView, {
        contentContainerStyle: { flexGrow: 1, justifyContent: 'center', padding: 20 },
        componentId: 'login-scroll'
      },
        React.createElement(View, { style: styles.loginCard, componentId: 'login-card' },
          React.createElement(Image, {
            source: { uri: 'IMAGE:modern-task-management-interface' },
            style: styles.loginImage,
            componentId: 'login-image'
          }),
          React.createElement(Text, { 
            style: [styles.loginTitle, { color: state.theme.colors.textPrimary }],
            componentId: 'login-title'
          }, 'AI Task Master'),
          React.createElement(Text, { 
            style: [styles.loginSubtitle, { color: state.theme.colors.textSecondary }],
            componentId: 'login-subtitle'
          }, 'Intelligent task management with AI'),
          React.createElement(TextInput, {
            style: [styles.input, { backgroundColor: state.theme.colors.card, borderColor: state.theme.colors.border, color: state.theme.colors.textPrimary }],
            placeholder: 'Username',
            placeholderTextColor: state.theme.colors.textSecondary,
            value: state.username,
            onChangeText: state.setUsername,
            autoCapitalize: 'none',
            componentId: 'login-username-input'
          }),
          React.createElement(TextInput, {
            style: [styles.input, { backgroundColor: state.theme.colors.card, borderColor: state.theme.colors.border, color: state.theme.colors.textPrimary }],
            placeholder: 'Password',
            placeholderTextColor: state.theme.colors.textSecondary,
            value: state.password,
            onChangeText: state.setPassword,
            secureTextEntry: true,
            componentId: 'login-password-input'
          }),
          React.createElement(TouchableOpacity, {
            style: [styles.loginButton, { backgroundColor: state.theme.colors.primary }],
            onPress: function() { handlers.handleLogin(state); },
            componentId: 'login-submit-button'
          },
            React.createElement(Text, { 
              style: styles.loginButtonText,
              componentId: 'login-button-text'
            }, 'Login')
          )
        )
      )
    );
  };
  // @end:LoginScreen

  // @section:HomeScreen-state @depends:[ThemeContext]
  const useHomeScreenState = function() {
    const themeContext = useTheme();
    const theme = themeContext.theme;
    
    const { data: tasks, loading: tasksLoading, refetch: refetchTasks } = useQuery('tasks', {}, { column: 'deadline', ascending: true });
    const { data: stepGoals, refetch: refetchSteps } = useQuery('step_goals');
    const { data: taskHistory, refetch: refetchHistory } = useQuery('task_history', {}, { column: 'completed_at', ascending: false });
    const { mutate: insertTask } = useMutation('tasks', 'insert');
    const { mutate: updateTask } = useMutation('tasks', 'update');
    const { mutate: updateStepGoal } = useMutation('step_goals', 'update');
    const { mutate: insertStepGoal } = useMutation('step_goals', 'insert');
    
    const showMenuState = useState(false);
    const showMenu = showMenuState[0];
    const setShowMenu = showMenuState[1];
    const showAddTaskState = useState(false);
    const showAddTask = showAddTaskState[0];
    const setShowAddTask = showAddTaskState[1];
    const showChatState = useState(false);
    const showChat = showChatState[0];
    const setShowChat = showChatState[1];
    const showStepSettingsState = useState(false);
    const showStepSettings = showStepSettingsState[0];
    const setShowStepSettings = showStepSettingsState[1];
    
    const newTaskNameState = useState('');
    const newTaskName = newTaskNameState[0];
    const setNewTaskName = newTaskNameState[1];
    const newTaskDeadlineState = useState('');
    const newTaskDeadline = newTaskDeadlineState[0];
    const setNewTaskDeadline = newTaskDeadlineState[1];
    const stepGoalInputState = useState('');
    const stepGoalInput = stepGoalInputState[0];
    const setStepGoalInput = stepGoalInputState[1];
    const chatMessageState = useState('');
    const chatMessage = chatMessageState[0];
    const setChatMessage = chatMessageState[1];
    
    const currentSteps = stepGoals && stepGoals.length > 0 ? stepGoals[0].current_steps || 0 : 0;
    const dailyGoal = stepGoals && stepGoals.length > 0 ? stepGoals[0].daily_goal || 10000 : 10000;
    
    const completedTasks = useMemo(function() {
      return tasks ? tasks.filter(function(task) { return task.completed; }) : [];
    }, [tasks]);
    
    const pendingTasks = useMemo(function() {
      const pending = tasks ? tasks.filter(function(task) { return !task.completed; }) : [];
      return pending.sort(function(a, b) {
        const dateA = new Date(a.deadline);
        const dateB = new Date(b.deadline);
        return dateA - dateB;
      });
    }, [tasks]);
    
    return {
      theme: theme,
      tasks: tasks || [],
      completedTasks: completedTasks,
      pendingTasks: pendingTasks,
      taskHistory: taskHistory || [],
      currentSteps: currentSteps,
      dailyGoal: dailyGoal,
      showMenu: showMenu,
      setShowMenu: setShowMenu,
      showAddTask: showAddTask,
      setShowAddTask: setShowAddTask,
      showChat: showChat,
      setShowChat: setShowChat,
      showStepSettings: showStepSettings,
      setShowStepSettings: setShowStepSettings,
      newTaskName: newTaskName,
      setNewTaskName: setNewTaskName,
      newTaskDeadline: newTaskDeadline,
      setNewTaskDeadline: setNewTaskDeadline,
      stepGoalInput: stepGoalInput,
      setStepGoalInput: setStepGoalInput,
      chatMessage: chatMessage,
      setChatMessage: setChatMessage,
      insertTask: insertTask,
      updateTask: updateTask,
      updateStepGoal: updateStepGoal,
      insertStepGoal: insertStepGoal,
      refetchTasks: refetchTasks,
      refetchSteps: refetchSteps,
      refetchHistory: refetchHistory,
      tasksLoading: tasksLoading
    };
  };
  // @end:HomeScreen-state

  // @section:HomeScreen-helpers @depends:[]
  const homeScreenHelpers = {
    getPriorityLevel: function(deadline) {
      const now = new Date();
      const taskDate = new Date(deadline);
      const diffTime = taskDate - now;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays <= 1) return 'high';
      if (diffDays <= 3) return 'medium-high';
      if (diffDays <= 7) return 'medium';
      return 'low';
    },
    
    getPriorityColor: function(theme, priority) {
      switch(priority) {
        case 'high': return theme.colors.highPriority;
        case 'medium-high': return theme.colors.mediumHighPriority;
        case 'medium': return theme.colors.mediumPriority;
        case 'low': return theme.colors.lowPriority;
        default: return theme.colors.textSecondary;
      }
    },
    
    formatDate: function(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    getStepProgress: function(current, goal) {
      return Math.min((current / goal) * 100, 100);
    }
  };
  // @end:HomeScreen-helpers

  // @section:HomeScreen-handlers @depends:[HomeScreen-state,HomeScreen-helpers]
  const homeScreenHandlers = {
    addTask: function(state) {
      if (!state.newTaskName.trim() || !state.newTaskDeadline.trim()) {
        Platform.OS === 'web' ? window.alert('Please fill in task name and deadline') : Alert.alert('Error', 'Please fill in task name and deadline');
        return;
      }
      
      const taskData = {
        name: state.newTaskName.trim(),
        deadline: state.newTaskDeadline,
        completed: false,
        created_at: new Date().toISOString()
      };
      
      state.insertTask(taskData)
        .then(function() {
          state.refetchTasks();
          state.setNewTaskName('');
          state.setNewTaskDeadline('');
          state.setShowAddTask(false);
          Platform.OS === 'web' ? window.alert('Task added successfully') : Alert.alert('Success', 'Task added successfully');
        })
        .catch(function(error) {
          Platform.OS === 'web' ? window.alert(error.message) : Alert.alert('Error', error.message);
        });
    },
    
    completeTask: function(state, task) {
      const updatedData = { completed: true, completed_at: new Date().toISOString() };
      state.updateTask({ id: task.id, data: updatedData })
        .then(function() {
          state.refetchTasks();
          state.refetchHistory();
        })
        .catch(function(error) {
          Platform.OS === 'web' ? window.alert(error.message) : Alert.alert('Error', error.message);
        });
    },
    
    undoTask: function(state, task) {
      const updatedData = { completed: false, completed_at: null };
      state.updateTask({ id: task.id, data: updatedData })
        .then(function() {
          state.refetchTasks();
          state.refetchHistory();
        })
        .catch(function(error) {
          Platform.OS === 'web' ? window.alert(error.message) : Alert.alert('Error', error.message);
        });
    },
    
    updateStepGoal: function(state) {
      const newGoal = parseInt(state.stepGoalInput);
      if (isNaN(newGoal) || newGoal <= 0) {
        Platform.OS === 'web' ? window.alert('Please enter a valid step goal') : Alert.alert('Error', 'Please enter a valid step goal');
        return;
      }
      
      const goalData = {
        daily_goal: newGoal,
        current_steps: state.currentSteps,
        date: new Date().toISOString().split('T')[0]
      };
      
      if (state.dailyGoal) {
        state.updateStepGoal({ id: 'step-goal-1', data: goalData })
          .then(function() {
            state.refetchSteps();
            state.setShowStepSettings(false);
            state.setStepGoalInput('');
          })
          .catch(function(error) {
            Platform.OS === 'web' ? window.alert(error.message) : Alert.alert('Error', error.message);
          });
      } else {
        state.insertStepGoal(goalData)
          .then(function() {
            state.refetchSteps();
            state.setShowStepSettings(false);
            state.setStepGoalInput('');
          })
          .catch(function(error) {
            Platform.OS === 'web' ? window.alert(error.message) : Alert.alert('Error', error.message);
          });
      }
    }
  };
  // @end:HomeScreen-handlers

  // @section:HomeScreen-MenuModal @depends:[styles]
  const renderMenuModal = function(state) {
    return React.createElement(Modal, {
      visible: state.showMenu,
      animationType: 'fade',
      transparent: true,
      onRequestClose: function() { state.setShowMenu(false); }
    },
      React.createElement(TouchableOpacity, {
        style: styles.modalOverlay,
        onPress: function() { state.setShowMenu(false); },
        componentId: 'menu-overlay'
      },
        React.createElement(View, {
          style: [styles.menuModal, { backgroundColor: state.theme.colors.card }],
          componentId: 'menu-modal'
        },
          React.createElement(Text, {
            style: [styles.menuTitle, { color: state.theme.colors.textPrimary }],
            componentId: 'menu-title'
          }, 'Menu'),
          React.createElement(TouchableOpacity, {
            style: styles.menuItem,
            onPress: function() { state.setShowMenu(false); },
            componentId: 'menu-calendar'
          },
            React.createElement(MaterialIcons, { name: 'calendar-today', size: 20, color: state.theme.colors.textSecondary }),
            React.createElement(Text, {
              style: [styles.menuItemText, { color: state.theme.colors.textPrimary }],
              componentId: 'menu-calendar-text'
            }, 'Calendar')
          ),
          React.createElement(TouchableOpacity, {
            style: styles.menuItem,
            onPress: function() { state.setShowMenu(false); },
            componentId: 'menu-performance'
          },
            React.createElement(MaterialIcons, { name: 'trending-up', size: 20, color: state.theme.colors.textSecondary }),
            React.createElement(Text, {
              style: [styles.menuItemText, { color: state.theme.colors.textPrimary }],
              componentId: 'menu-performance-text'
            }, 'My Performance')
          ),
          React.createElement(TouchableOpacity, {
            style: styles.menuItem,
            onPress: function() { state.setShowMenu(false); },
            componentId: 'menu-settings'
          },
            React.createElement(MaterialIcons, { name: 'settings', size: 20, color: state.theme.colors.textSecondary }),
            React.createElement(Text, {
              style: [styles.menuItemText, { color: state.theme.colors.textPrimary }],
              componentId: 'menu-settings-text'
            }, 'Settings')
          ),
          React.createElement(TouchableOpacity, {
            style: styles.menuItem,
            onPress: function() { state.setShowMenu(false); },
            componentId: 'menu-history'
          },
            React.createElement(MaterialIcons, { name: 'history', size: 20, color: state.theme.colors.textSecondary }),
            React.createElement(Text, {
              style: [styles.menuItemText, { color: state.theme.colors.textPrimary }],
              componentId: 'menu-history-text'
            }, 'Work History')
          ),
          React.createElement(TouchableOpacity, {
            style: styles.menuItem,
            onPress: function() { state.setShowMenu(false); },
            componentId: 'menu-focus'
          },
            React.createElement(MaterialIcons, { name: 'center-focus-strong', size: 20, color: state.theme.colors.textSecondary }),
            React.createElement(Text, {
              style: [styles.menuItemText, { color: state.theme.colors.textPrimary }],
              componentId: 'menu-focus-text'
            }, 'Focus Mode')
          ),
          React.createElement(TouchableOpacity, {
            style: styles.menuItem,
            onPress: function() { state.setShowMenu(false); },
            componentId: 'menu-logout'
          },
            React.createElement(MaterialIcons, { name: 'exit-to-app', size: 20, color: state.theme.colors.error }),
            React.createElement(Text, {
              style: [styles.menuItemText, { color: state.theme.colors.error }],
              componentId: 'menu-logout-text'
            }, 'Logout')
          )
        )
      )
    );
  };
  // @end:HomeScreen-MenuModal

  // @section:HomeScreen-ChatModal @depends:[styles]
  const renderChatModal = function(state) {
    return React.createElement(Modal, {
      visible: state.showChat,
      animationType: 'slide',
      transparent: false,
      onRequestClose: function() { state.setShowChat(false); }
    },
      React.createElement(View, {
        style: [styles.container, { backgroundColor: state.theme.colors.background }],
        componentId: 'chat-container'
      },
        React.createElement(View, {
          style: [styles.chatHeader, { backgroundColor: state.theme.colors.card }],
          componentId: 'chat-header'
        },
          React.createElement(TouchableOpacity, {
            onPress: function() { state.setShowChat(false); },
            componentId: 'chat-back-button'
          },
            React.createElement(MaterialIcons, { name: 'arrow-back', size: 24, color: state.theme.colors.textPrimary })
          ),
          React.createElement(Text, {
            style: [styles.chatHeaderTitle, { color: state.theme.colors.textPrimary }],
            componentId: 'chat-header-title'
          }, 'AI Assistant')
        ),
        React.createElement(ScrollView, {
          style: { flex: 1, padding: 16 },
          componentId: 'chat-messages'
        },
          React.createElement(View, {
            style: [styles.chatBubble, styles.assistantBubble, { backgroundColor: state.theme.colors.primary }],
            componentId: 'chat-welcome-bubble'
          },
            React.createElement(Text, {
              style: styles.chatBubbleText,
              componentId: 'chat-welcome-text'
            }, 'Hello! I can help you prioritize your tasks and answer questions about your work. What would you like to know?')
          )
        ),
        React.createElement(View, {
          style: [styles.chatInputContainer, { backgroundColor: state.theme.colors.card }],
          componentId: 'chat-input-container'
        },
          React.createElement(TextInput, {
            style: [styles.chatInput, { backgroundColor: state.theme.colors.background, color: state.theme.colors.textPrimary }],
            placeholder: 'Ask me about your tasks...',
            placeholderTextColor: state.theme.colors.textSecondary,
            value: state.chatMessage,
            onChangeText: state.setChatMessage,
            multiline: true,
            componentId: 'chat-input'
          }),
          React.createElement(TouchableOpacity, {
            style: [styles.chatSendButton, { backgroundColor: state.theme.colors.primary }],
            onPress: function() {
              if (state.chatMessage.trim()) {
                Platform.OS === 'web' ? window.alert('AI response will be implemented with your API key') : Alert.alert('AI Response', 'AI response will be implemented with your API key');
                state.setChatMessage('');
              }
            },
            componentId: 'chat-send-button'
          },
            React.createElement(MaterialIcons, { name: 'send', size: 20, color: '#FFFFFF' })
          )
        )
      )
    );
  };
  // @end:HomeScreen-ChatModal

  // @section:HomeScreen-AddTaskModal @depends:[styles]
  const renderAddTaskModal = function(state, handlers) {
    return React.createElement(Modal, {
      visible: state.showAddTask,
      animationType: 'slide',
      transparent: true,
      onRequestClose: function() { state.setShowAddTask(false); }
    },
      React.createElement(KeyboardAvoidingView, {
        style: styles.modalOverlay,
        behavior: Platform.OS === 'ios' ? 'padding' : (Platform.OS === 'web' ? undefined : 'height'),
        componentId: 'add-task-keyboard-avoiding'
      },
        React.createElement(View, {
          style: [styles.modalContent, { backgroundColor: state.theme.colors.card }],
          componentId: 'add-task-modal'
        },
          React.createElement(Text, {
            style: [styles.modalTitle, { color: state.theme.colors.textPrimary }],
            componentId: 'add-task-title'
          }, 'Add New Task'),
          React.createElement(TextInput, {
            style: [styles.input, { backgroundColor: state.theme.colors.background, borderColor: state.theme.colors.border, color: state.theme.colors.textPrimary }],
            placeholder: 'Task name',
            placeholderTextColor: state.theme.colors.textSecondary,
            value: state.newTaskName,
            onChangeText: state.setNewTaskName,
            componentId: 'add-task-name-input'
          }),
          React.createElement(TextInput, {
            style: [styles.input, { backgroundColor: state.theme.colors.background, borderColor: state.theme.colors.border, color: state.theme.colors.textPrimary }],
            placeholder: 'Deadline (YYYY-MM-DD HH:MM)',
            placeholderTextColor: state.theme.colors.textSecondary,
            value: state.newTaskDeadline,
            onChangeText: state.setNewTaskDeadline,
            componentId: 'add-task-deadline-input'
          }),
          React.createElement(View, { style: styles.modalButtons, componentId: 'add-task-buttons' },
            React.createElement(TouchableOpacity, {
              style: [styles.modalButton, styles.cancelButton, { borderColor: state.theme.colors.textSecondary }],
              onPress: function() { 
                state.setShowAddTask(false);
                state.setNewTaskName('');
                state.setNewTaskDeadline('');
              },
              componentId: 'add-task-cancel-button'
            },
              React.createElement(Text, {
                style: [styles.modalButtonText, { color: state.theme.colors.textSecondary }],
                componentId: 'add-task-cancel-text'
              }, 'Cancel')
            ),
            React.createElement(TouchableOpacity, {
              style: [styles.modalButton, { backgroundColor: state.theme.colors.primary }],
              onPress: function() { handlers.addTask(state); },
              componentId: 'add-task-submit-button'
            },
              React.createElement(Text, {
                style: [styles.modalButtonText, { color: '#FFFFFF' }],
                componentId: 'add-task-submit-text'
              }, 'Add Task')
            )
          )
        )
      )
    );
  };
  // @end:HomeScreen-AddTaskModal

  // @section:HomeScreen-StepSettingsModal @depends:[styles]
  const renderStepSettingsModal = function(state, handlers) {
    return React.createElement(Modal, {
      visible: state.showStepSettings,
      animationType: 'slide',
      transparent: true,
      onRequestClose: function() { state.setShowStepSettings(false); }
    },
      React.createElement(View, { style: styles.modalOverlay, componentId: 'step-settings-overlay' },
        React.createElement(View, {
          style: [styles.modalContent, { backgroundColor: state.theme.colors.card }],
          componentId: 'step-settings-modal'
        },
          React.createElement(Text, {
            style: [styles.modalTitle, { color: state.theme.colors.textPrimary }],
            componentId: 'step-settings-title'
          }, 'Set Daily Step Goal'),
          React.createElement(TextInput, {
            style: [styles.input, { backgroundColor: state.theme.colors.background, borderColor: state.theme.colors.border, color: state.theme.colors.textPrimary }],
            placeholder: 'Enter step goal (e.g., 10000)',
            placeholderTextColor: state.theme.colors.textSecondary,
            value: state.stepGoalInput,
            onChangeText: state.setStepGoalInput,
            keyboardType: 'numeric',
            componentId: 'step-goal-input'
          }),
          React.createElement(View, { style: styles.modalButtons, componentId: 'step-settings-buttons' },
            React.createElement(TouchableOpacity, {
              style: [styles.modalButton, styles.cancelButton, { borderColor: state.theme.colors.textSecondary }],
              onPress: function() { 
                state.setShowStepSettings(false);
                state.setStepGoalInput('');
              },
              componentId: 'step-settings-cancel-button'
            },
              React.createElement(Text, {
                style: [styles.modalButtonText, { color: state.theme.colors.textSecondary }],
                componentId: 'step-settings-cancel-text'
              }, 'Cancel')
            ),
            React.createElement(TouchableOpacity, {
              style: [styles.modalButton, { backgroundColor: state.theme.colors.primary }],
              onPress: function() { handlers.updateStepGoal(state); },
              componentId: 'step-settings-submit-button'
            },
              React.createElement(Text, {
                style: [styles.modalButtonText, { color: '#FFFFFF' }],
                componentId: 'step-settings-submit-text'
              }, 'Save Goal')
            )
          )
        )
      )
    );
  };
  // @end:HomeScreen-StepSettingsModal

  // @section:HomeScreen-StepCounter @depends:[HomeScreen-helpers,styles]
  const renderStepCounter = function(state, helpers) {
    const progress = helpers.getStepProgress(state.currentSteps, state.dailyGoal);
    const radius = 40;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = circumference + ' ' + circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    return React.createElement(View, { style: styles.stepCounterContainer, componentId: 'step-counter-container' },
      React.createElement(View, { style: styles.stepCounterHeader, componentId: 'step-counter-header' },
        React.createElement(Text, {
          style: [styles.stepCounterTitle, { color: state.theme.colors.textPrimary }],
          componentId: 'step-counter-title'
        }, 'Daily Steps'),
        React.createElement(TouchableOpacity, {
          onPress: function() { 
            state.setStepGoalInput(state.dailyGoal.toString());
            state.setShowStepSettings(true); 
          },
          componentId: 'step-counter-settings-button'
        },
          React.createElement(MaterialIcons, { name: 'settings', size: 20, color: state.theme.colors.textSecondary })
        )
      ),
      React.createElement(View, { style: styles.circularProgress, componentId: 'circular-progress' },
        React.createElement(View, {
          style: [
            styles.progressCircle,
            { 
              borderColor: state.theme.colors.border,
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius
            }
          ],
          componentId: 'progress-circle-background'
        }),
        React.createElement(View, {
          style: [
            styles.progressFill,
            {
              borderColor: state.theme.colors.success,
              borderWidth: strokeWidth,
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,
              transform: [{ rotate: (-90 + (progress * 3.6)) + 'deg' }]
            }
          ],
          componentId: 'progress-circle-fill'
        }),
        React.createElement(View, { style: styles.progressText, componentId: 'progress-text-container' },
          React.createElement(Text, {
            style: [styles.stepCount, { color: state.theme.colors.textPrimary }],
            componentId: 'step-count-text'
          }, state.currentSteps.toLocaleString()),
          React.createElement(Text, {
            style: [styles.stepGoal, { color: state.theme.colors.textSecondary }],
            componentId: 'step-goal-text'
          }, '/ ' + state.dailyGoal.toLocaleString())
        )
      )
    );
  };
  // @end:HomeScreen-StepCounter

  // @section:HomeScreen-TaskList @depends:[HomeScreen-helpers,styles]
  const renderTaskList = function(state, handlers, helpers) {
    if (state.tasksLoading) {
      return React.createElement(View, { 
        style: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
        componentId: 'tasks-loading'
      },
        React.createElement(ActivityIndicator, { 
          size: 'large', 
          color: state.theme.colors.primary,
          componentId: 'loading'
        })
      );
    }
    
    return React.createElement(View, { style: styles.prioritySection, componentId: 'priority-section' },
      React.createElement(View, { style: styles.priorityHeader, componentId: 'priority-header' },
        React.createElement(Text, {
          style: [styles.priorityTitle, { color: state.theme.colors.textPrimary }],
          componentId: 'priority-title'
        }, 'Priority Tasks'),
        React.createElement(View, {
          style: [styles.priorityBadge, { backgroundColor: state.theme.colors.primary }],
          componentId: 'priority-badge'
        },
          React.createElement(Text, {
            style: styles.priorityBadgeText,
            componentId: 'priority-badge-text'
          }, state.pendingTasks.length.toString())
        )
      ),
      React.createElement(ScrollView, {
        style: { maxHeight: 300 },
        showsVerticalScrollIndicator: false,
        componentId: 'priority-tasks-scroll'
      },
        state.pendingTasks.length === 0 ?
          React.createElement(View, { style: styles.emptyState, componentId: 'empty-tasks' },
            React.createElement(MaterialIcons, { name: 'task-alt', size: 48, color: state.theme.colors.textSecondary }),
            React.createElement(Text, {
              style: [styles.emptyText, { color: state.theme.colors.textSecondary }],
              componentId: 'empty-tasks-text'
            }, 'No tasks yet. Add your first task!')
          ) :
          state.pendingTasks.map(function(task, index) {
            const priority = helpers.getPriorityLevel(task.deadline);
            const priorityColor = helpers.getPriorityColor(state.theme, priority);
            
            return React.createElement(View, {
              key: task.id || index,
              style: [
                styles.taskItem,
                { 
                  backgroundColor: state.theme.colors.card,
                  borderLeftColor: priorityColor
                }
              ],
              componentId: 'task-item-' + index
            },
              React.createElement(TouchableOpacity, {
                style: styles.taskCheckbox,
                onPress: function() { handlers.completeTask(state, task); },
                componentId: 'task-checkbox-' + index
              },
                React.createElement(View, {
                  style: [
                    styles.checkbox,
                    { borderColor: priorityColor }
                  ],
                  componentId: 'checkbox-' + index
                })
              ),
              React.createElement(View, { style: styles.taskContent, componentId: 'task-content-' + index },
                React.createElement(Text, {
                  style: [styles.taskDeadline, { color: priorityColor }],
                  componentId: 'task-deadline-' + index
                }, helpers.formatDate(task.deadline)),
                React.createElement(Text, {
                  style: [styles.taskName, { color: state.theme.colors.textPrimary }],
                  componentId: 'task-name-' + index
                }, task.name)
              ),
              React.createElement(View, {
                style: [styles.priorityIndicator, { backgroundColor: priorityColor }],
                componentId: 'priority-indicator-' + index
              })
            );
          })
      )
    );
  };
  // @end:HomeScreen-TaskList

  // @section:HomeScreen-CompletedTasks @depends:[HomeScreen-helpers,styles]
  const renderCompletedTasks = function(state, handlers, helpers) {
    return React.createElement(View, { style: styles.completedSection, componentId: 'completed-section' },
      React.createElement(Text, {
        style: [styles.sectionTitle, { color: state.theme.colors.textPrimary }],
        componentId: 'completed-section-title'
      }, 'Work Done'),
      React.createElement(ScrollView, {
        style: { maxHeight: 200 },
        showsVerticalScrollIndicator: false,
        componentId: 'completed-tasks-scroll'
      },
        state.completedTasks.length === 0 ?
          React.createElement(View, { style: styles.emptyState, componentId: 'empty-completed' },
            React.createElement(Text, {
              style: [styles.emptyText, { color: state.theme.colors.textSecondary }],
              componentId: 'empty-completed-text'
            }, 'No completed tasks yet')
          ) :
          state.completedTasks.map(function(task, index) {
            return React.createElement(View, {
              key: task.id || index,
              style: [styles.completedTaskItem, { backgroundColor: state.theme.colors.card }],
              componentId: 'completed-task-' + index
            },
              React.createElement(MaterialIcons, { 
                name: 'check-circle', 
                size: 20, 
                color: state.theme.colors.success 
              }),
              React.createElement(View, { style: styles.taskContent, componentId: 'completed-content-' + index },
                React.createElement(Text, {
                  style: [styles.taskName, { color: state.theme.colors.textPrimary }],
                  componentId: 'completed-name-' + index
                }, task.name),
                task.completed_at && React.createElement(Text, {
                  style: [styles.completedTime, { color: state.theme.colors.textSecondary }],
                  componentId: 'completed-time-' + index
                }, helpers.formatDate(task.completed_at))
              ),
              React.createElement(TouchableOpacity, {
                style: styles.undoButton,
                onPress: function() { handlers.undoTask(state, task); },
                componentId: 'undo-button-' + index
              },
                React.createElement(Text, {
                  style: [styles.undoButtonText, { color: state.theme.colors.warning }],
                  componentId: 'undo-text-' + index
                }, 'UNDO')
              )
            );
          })
      )
    );
  };
  // @end:HomeScreen-CompletedTasks

  // @section:HomeScreen-HistoryBox @depends:[HomeScreen-helpers,styles]
  const renderHistoryBox = function(state, helpers) {
    const recentHistory = state.taskHistory.slice(0, 10);
    
    return React.createElement(View, { style: styles.historyBox, componentId: 'history-box' },
      React.createElement(Text, {
        style: [styles.sectionTitle, { color: state.theme.colors.textPrimary }],
        componentId: 'history-title'
      }, 'Recent History'),
      React.createElement(ScrollView, {
        style: { maxHeight: 150 },
        showsVerticalScrollIndicator: false,
        componentId: 'history-scroll'
      },
        recentHistory.length === 0 ?
          React.createElement(Text, {
            style: [styles.emptyText, { color: state.theme.colors.textSecondary }],
            componentId: 'empty-history-text'
          }, 'No recent history') :
          recentHistory.map(function(item, index) {
            return React.createElement(View, {
              key: item.id || index,
              style: styles.historyItem,
              componentId: 'history-item-' + index
            },
              React.createElement(Text, {
                style: [styles.historyTaskName, { color: state.theme.colors.textPrimary }],
                componentId: 'history-task-' + index
              }, item.task_name),
              React.createElement(Text, {
                style: [styles.historyTime, { color: state.theme.colors.textSecondary }],
                componentId: 'history-time-' + index
              }, helpers.formatDate(item.completed_at))
            );
          })
      )
    );
  };
  // @end:HomeScreen-HistoryBox

  // @section:HomeScreen @depends:[HomeScreen-state,HomeScreen-handlers,HomeScreen-helpers,HomeScreen-MenuModal,HomeScreen-ChatModal,HomeScreen-AddTaskModal,HomeScreen-StepSettingsModal,HomeScreen-StepCounter,HomeScreen-TaskList,HomeScreen-CompletedTasks,HomeScreen-HistoryBox,styles]
  const HomeScreen = function() {
    const state = useHomeScreenState();
    const handlers = homeScreenHandlers;
    const helpers = homeScreenHelpers;
    
    return React.createElement(View, { 
      style: [styles.container, { backgroundColor: state.theme.colors.background }],
      componentId: 'home-screen'
    },
      React.createElement(ScrollView, {
        style: { flex: 1 },
        contentContainerStyle: { paddingBottom: Platform.OS === 'web' ? 90 : 100 },
        componentId: 'home-scroll'
      },
        React.createElement(View, { style: styles.header, componentId: 'home-header' },
          React.createElement(TouchableOpacity, {
            style: styles.menuButton,
            onPress: function() { state.setShowMenu(true); },
            componentId: 'menu-button'
          },
            React.createElement(MaterialIcons, { name: 'menu', size: 24, color: state.theme.colors.textPrimary })
          ),
          React.createElement(TouchableOpacity, {
            style: styles.chatButton,
            onPress: function() { state.setShowChat(true); },
            componentId: 'chat-button'
          },
            React.createElement(MaterialIcons, { name: 'chat', size: 24, color: state.theme.colors.primary }),
            React.createElement(Text, {
              style: [styles.chatButtonText, { color: state.theme.colors.primary }],
              componentId: 'chat-button-text'
            }, 'AI Assistant')
          ),
          renderStepCounter(state, helpers)
        ),
        renderTaskList(state, handlers, helpers),
        React.createElement(View, { style: styles.bottomSection, componentId: 'bottom-section' },
          renderHistoryBox(state, helpers),
          renderCompletedTasks(state, handlers, helpers)
        )
      ),
      React.createElement(TouchableOpacity, {
        style: [styles.fab, { backgroundColor: state.theme.colors.primary }],
        onPress: function() { state.setShowAddTask(true); },
        componentId: 'add-task-fab'
      },
        React.createElement(MaterialIcons, { name: 'add', size: 28, color: '#FFFFFF' })
      ),
      renderMenuModal(state),
      renderChatModal(state),
      renderAddTaskModal(state, handlers),
      renderStepSettingsModal(state, handlers)
    );
  };
  // @end:HomeScreen

  // @section:CalendarScreen @depends:[ThemeContext,styles]
  const CalendarScreen = function() {
    const themeContext = useTheme();
    const theme = themeContext.theme;
    
    return React.createElement(View, { 
      style: [styles.container, { backgroundColor: theme.colors.background }],
      componentId: 'calendar-screen'
    },
      React.createElement(View, { style: styles.centerContent, componentId: 'calendar-center' },
        React.createElement(MaterialIcons, { name: 'calendar-today', size: 64, color: theme.colors.textSecondary }),
        React.createElement(Text, {
          style: [styles.placeholderTitle, { color: theme.colors.textPrimary }],
          componentId: 'calendar-title'
        }, 'Calendar'),
        React.createElement(Text, {
          style: [styles.placeholderText, { color: theme.colors.textSecondary }],
          componentId: 'calendar-text'
        }, 'Calendar view coming soon')
      )
    );
  };
  // @end:CalendarScreen

  // @section:PerformanceScreen @depends:[ThemeContext,styles]
  const PerformanceScreen = function() {
    const themeContext = useTheme();
    const theme = themeContext.theme;
    
    return React.createElement(View, { 
      style: [styles.container, { backgroundColor: theme.colors.background }],
      componentId: 'performance-screen'
    },
      React.createElement(View, { style: styles.centerContent, componentId: 'performance-center' },
        React.createElement(MaterialIcons, { name: 'trending-up', size: 64, color: theme.colors.textSecondary }),
        React.createElement(Text, {
          style: [styles.placeholderTitle, { color: theme.colors.textPrimary }],
          componentId: 'performance-title'
        }, 'Performance'),
        React.createElement(Text, {
          style: [styles.placeholderText, { color: theme.colors.textSecondary }],
          componentId: 'performance-text'
        }, 'Performance analytics coming soon')
      )
    );
  };
  // @end:PerformanceScreen

  // @section:SettingsScreen @depends:[ThemeContext,styles]
  const SettingsScreen = function() {
    const themeContext = useTheme();
    const theme = themeContext.theme;
    
    return React.createElement(View, { 
      style: [styles.container, { backgroundColor: theme.colors.background }],
      componentId: 'settings-screen'
    },
      React.createElement(View, { style: styles.centerContent, componentId: 'settings-center' },
        React.createElement(MaterialIcons, { name: 'settings', size: 64, color: theme.colors.textSecondary }),
        React.createElement(Text, {
          style: [styles.placeholderTitle, { color: theme.colors.textPrimary }],
          componentId: 'settings-title'
        }, 'Settings'),
        React.createElement(Text, {
          style: [styles.placeholderText, { color: theme.colors.textSecondary }],
          componentId: 'settings-text'
        }, 'Settings panel coming soon')
      )
    );
  };
  // @end:SettingsScreen

  // @section:styles @depends:[theme]
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    },
    placeholderTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8
    },
    placeholderText: {
      fontSize: 16,
      textAlign: 'center'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      paddingTop: 50
    },
    menuButton: {
      padding: 8
    },
    chatButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cardColor,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    chatButtonText: {
      marginLeft: 4,
      fontSize: 12,
      fontWeight: '500'
    },
    stepCounterContainer: {
      backgroundColor: cardColor,
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    stepCounterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    },
    stepCounterTitle: {
      fontSize: 14,
      fontWeight: '600'
    },
    circularProgress: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    progressCircle: {
      borderWidth: 8,
      position: 'absolute'
    },
    progressFill: {
      borderWidth: 0,
      borderTopWidth: 8,
      borderRightWidth: 8,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      position: 'absolute'
    },
    progressText: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    stepCount: {
      fontSize: 18,
      fontWeight: 'bold'
    },
    stepGoal: {
      fontSize: 12
    },
    prioritySection: {
      margin: 20,
      backgroundColor: cardColor,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6
    },
    priorityHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    },
    priorityTitle: {
      fontSize: 20,
      fontWeight: 'bold'
    },
    priorityBadge: {
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4
    },
    priorityBadgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold'
    },
    taskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderLeftWidth: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    taskCheckbox: {
      marginRight: 12
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2
    },
    taskContent: {
      flex: 1
    },
    taskDeadline: {
      fontSize: 12,
      fontWeight: '500',
      marginBottom: 4
    },
    taskName: {
      fontSize: 16,
      fontWeight: '500'
    },
    priorityIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4
    },
    bottomSection: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingBottom: 20
    },
    historyBox: {
      flex: 1,
      backgroundColor: cardColor,
      borderRadius: 16,
      padding: 16,
      marginRight: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    completedSection: {
      flex: 1,
      backgroundColor: cardColor,
      borderRadius: 16,
      padding: 16,
      marginLeft: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 12
    },
    historyItem: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6'
    },
    historyTaskName: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 2
    },
    historyTime: {
      fontSize: 12
    },
    completedTaskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8
    },
    completedTime: {
      fontSize: 12,
      marginTop: 2
    },
    undoButton: {
      paddingHorizontal: 8,
      paddingVertical: 4
    },
    undoButtonText: {
      fontSize: 12,
      fontWeight: 'bold'
    },
    fab: {
      position: 'absolute',
      bottom: Platform.OS === 'web' ? 100 : 110,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8
    },
    emptyState: {
      alignItems: 'center',
      padding: 20
    },
    emptyText: {
      fontSize: 14,
      textAlign: 'center',
      marginTop: 8
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalContent: {
      width: '90%',
      maxWidth: 400,
      borderRadius: 16,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center'
    },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      marginBottom: 16
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    modalButton: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginHorizontal: 6
    },
    cancelButton: {
      borderWidth: 1
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600'
    },
    menuModal: {
      width: '80%',
      maxWidth: 300,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8
    },
    menuTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center'
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8
    },
    menuItemText: {
      fontSize: 16,
      marginLeft: 12
    },
    chatHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB'
    },
    chatHeaderTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 16
    },
    chatBubble: {
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
      maxWidth: '80%'
    },
    assistantBubble: {
      alignSelf: 'flex-start'
    },
    chatBubbleText: {
      color: '#FFFFFF',
      fontSize: 16
    },
    chatInputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB'
    },
    chatInput: {
      flex: 1,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginRight: 12,
      maxHeight: 100
    },
    chatSendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },
    loginCard: {
      backgroundColor: cardColor,
      borderRadius: 20,
      padding: 32,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8
    },
    loginImage: {
      width: '100%',
      height: 120,
      borderRadius: 12,
      marginBottom: 24
    },
    loginTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8
    },
    loginSubtitle: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 32
    },
    loginButton: {
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginTop: 16
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold'
    }
  });
  // @end:styles

  // @section:TabNavigator @depends:[LoginScreen,HomeScreen,CalendarScreen,PerformanceScreen,SettingsScreen,navigation-setup]
  const TabNavigator = function() {
    const isLoggedInState = useState(false);
    const isLoggedIn = isLoggedInState[0];
    const setIsLoggedIn = isLoggedInState[1];
    
    if (!isLoggedIn) {
      return React.createElement(LoginScreen);
    }
    
    return React.createElement(Tab.Navigator, tabConfig,
      React.createElement(Tab.Screen, {
        name: 'Home',
        component: HomeScreen,
        options: {
          tabBarIcon: function(props) {
            return React.createElement(MaterialIcons, {
              name: 'home',
              size: 24,
              color: props.color
            });
          }
        }
      }),
      React.createElement(Tab.Screen, {
        name: 'Calendar',
        component: CalendarScreen,
        options: {
          tabBarIcon: function(props) {
            return React.createElement(MaterialIcons, {
              name: 'calendar-today',
              size: 24,
              color: props.color
            });
          }
        }
      }),
      React.createElement(Tab.Screen, {
        name: 'Performance',
        component: PerformanceScreen,
        options: {
          tabBarIcon: function(props) {
            return React.createElement(MaterialIcons, {
              name: 'trending-up',
              size: 24,
              color: props.color
            });
          }
        }
      }),
      React.createElement(Tab.Screen, {
        name: 'Settings',
        component: SettingsScreen,
        options: {
          tabBarIcon: function(props) {
            return React.createElement(MaterialIcons, {
              name: 'settings',
              size: 24,
              color: props.color
            });
          }
        }
      })
    );
  };
  // @end:TabNavigator

  // @section:return @depends:[ThemeProvider,TabNavigator]
  return React.createElement(ThemeProvider, null,
    React.createElement(View, { style: { flex: 1, width: '100%', height: '100%' } },
      React.createElement(StatusBar, { barStyle: 'dark-content' }),
      React.createElement(TabNavigator)
    )
  );
  // @end:return
};
return ComponentFunction