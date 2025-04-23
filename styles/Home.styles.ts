import { StyleSheet, Dimensions } from "react-native";

export const HomeStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#13131A",
  },
  header: {
    height: 50,
    backgroundColor: "#13131A",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  burgerButton: {
    padding: 8,
  },
  webview: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: "60%",
    overflow: "hidden",
  },
  sideMenuContent: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 10,
  },
  sideButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 6,
    backgroundColor: "#13131a",
    borderRadius: 4,
    shadowColor: "rgba(120,133,243,1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  sideButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
