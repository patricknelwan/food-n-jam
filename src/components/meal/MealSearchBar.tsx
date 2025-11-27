import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import { theme } from '../../theme';

interface MealSearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  autoFocus?: boolean;
}

export const MealSearchBar: React.FC<MealSearchBarProps> = ({
  placeholder = 'Search for meals...',
  onSearch,
  onClear,
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');

  const handleChangeText = (text: string) => {
    setQuery(text);

    // Debounce search
    if (text.length === 0) {
      onClear?.();
    } else if (text.length >= 2) {
      onSearch(text);
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear?.();
  };

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.grey40}
        autoFocus={autoFocus}
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
      />

      {query.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.grey60,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.grey10,
    paddingVertical: 4,
    ...Typography.text70,
  },
  clearButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.grey70,
  },
  clearText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
  },
});
