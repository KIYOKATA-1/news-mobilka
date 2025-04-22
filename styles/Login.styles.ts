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
    
        ...Platform.select({
          ios: {
            shadowColor: 'rgba(120, 133, 243, 1)',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          },
          android: {
            elevation: 5,
          },
        }),
    }
});

