//This is an example code for React Native Bottom Action Sheet//
import React from 'react';
//import react in our code.
import { View, Button } from 'react-native';
// import all basic components
import ActionSheet from 'react-native-actionsheet';
// import ActionSheet
export default function Demo() {
  const showActionSheet = () => {
    //To show the Bottom ActionSheet
    React.Component.ActionSheet.show();
  };
    //Options to show in bottom action sheet. Option Array can be dynamic too
    var optionArray = [
      'Option 1',
      'Option 2',
      'Option 3',
      'Option 4',
      'Cancel',
    ];

    return (
      <View style={{ padding: 25, flex: 1, justifyContent: 'center' }}>
        <Button
          onPress={showActionSheet}
          title="Open Buttom ActionSheet"
        />
        <ActionSheet
          ref={o => (React.Component.ActionSheet = o)}
          //Title of the Bottom Sheet
          title={'Which one do you like ?'}
          //Options Array to show in bottom sheet
          options={optionArray}
          //Define cancel button index in the option array
          //this will take the cancel option in bottom and will highlight it
          cancelButtonIndex={4}
          //If you want to highlight any specific option you can use below prop
          destructiveButtonIndex={1}
          onPress={index => {
            //Clicking on the option will give you the index of the option clicked
            alert(optionArray[index]);
          }}
        />
      </View>
    );
  }