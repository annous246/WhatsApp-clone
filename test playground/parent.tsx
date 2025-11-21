// TabsList.tsx
import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { SwipeableTab } from "./element";

const initialTabs = [
  "Tab 1",
  "Tab 2",
  "Tab 3",
  "Tab 1",
  "Tab 2",
  "Tab 3",
  "Tab 1",
  "Tab 2",
  "Tab 3",
  "Tab 1",
  "Tab 2",
  "Tab 3",
  "Tab 1",
  "Tab 2",
  "Tab 3",
];

const TabsList = () => {
  const [tabs, setTabs] = useState(initialTabs);

  const removeTab = (index: number) => {
    setTabs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View>
      <FlatList
        data={tabs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <SwipeableTab title={item} onRemove={() => removeTab(index)} />
        )}
      />
    </View>
  );
};

export default TabsList;
