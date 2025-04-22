import { StyleSheet, Platform } from "react-native";
export const LoginStyle = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#13131A',
    },
    title:{
        fontSize: 24,
        color: '#fff',
        marginBottom: 16
    },
    loginBtn:{
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        alignSelf: 'center',
      
        ...Platform.select({
          ios: {
            shadowColor: 'rgba(120, 133, 243, 1)',
            shadowOffset: { width: 4, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          },
          android: {
            elevation: 5,
          },
        }),
    },
    btnTxt:{
        color: 'black',
        textTransform: 'uppercase',
        fontSize: 14,
        fontWeight: '600',
    }
});

