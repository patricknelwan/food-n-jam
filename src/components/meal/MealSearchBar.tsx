import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { View, Colors, Typography } from 'react-native-ui-lib';
import { UI_CONSTANTS } from '@utils/constants';

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

  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <Text style={styles.iconText}>🔍</Text>
      </View>
      
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.grey40}
        autoFocus={autoFocus}
        returnKeyType="search"
        onSubmitEditing={() => onSearch(query)}
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
    borderRadius: UI_CONSTANTS.BUTTON_BORDER_RADIUS,
    paddingHorizontal: UI_CONSTANTS.SPACING.md,
    paddingVertical: UI_CONSTANTS.SPACING.sm,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  
  searchIcon: {
    marginRight: UI_CONSTANTS.SPACING.sm,
  },
  
  iconText: {
    fontSize: 16,
    color: Colors.grey30,
  },
  
  input: {
    flex: 1,
    ...Typography.text70,
    color: Colors.text,
    paddingVertical: 0,
  },
  
  clearButton: {
    marginLeft: UI_CONSTANTS.SPACING.sm,
    padding: UI_CONSTANTS.SPACING.xs,
  },
  
  clearText: {
    fontSize: 14,
    color: Colors.grey30,
  },
});
