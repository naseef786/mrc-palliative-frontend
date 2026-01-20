import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../store/auth.store";
// Screens
import AppStatusBar from "@/components/AppStatusBar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useThemeStore } from "@/store/theme.store";
import CertificationGeneration from "./certificate_generation";
import Help from "./help";
import Home from "./home";
import PatientList from "./patientList";
import Schedules from "./schedules";
import SettingScreen from "./settings";
import Tasks from "./tasks";
import VolunteersList from "./volunteersList";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Bottom tabs navigator
function BottomTabs() {
    const role = useAuthStore((s) => s.role);
    const theme = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.text,
                tabBarStyle: {
                    backgroundColor: theme.colors.card,
                    borderTopColor: theme.colors.border,
                },
                headerStyle: { backgroundColor: theme.colors.card },
                headerTintColor: theme.colors.text,
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
                }}
            />

            {role === "admin" && (
                <Tab.Screen
                    name="Schedules"
                    component={Schedules}
                    options={{
                        tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
                    }}
                />
            )}


            {role === "admin" && (
                <Tab.Screen
                    name="Volunteers"
                    component={VolunteersList}
                    options={{
                        tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
                    }}
                />
            )}
            {role === "admin" && (
                <Tab.Screen
                    name="PatientList"
                    component={PatientList}
                    options={{
                        tabBarIcon: ({ color, size }) => <FontAwesome5 name="user-injured" size={size} color={color} />,
                    }}
                />
            )}
            {role === "volunteer" && (
                <Tab.Screen
                    name="Tasks"
                    component={Tasks}
                    options={{
                        tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-done-outline" size={size} color={color} />,
                    }}
                />
            )}
        </Tab.Navigator>
    );
}

// (main)/_layout.tsx
function CustomDrawerContent({ navigation }: any) {
    const { role, logout } = useAuthStore();
    const theme = useTheme();
    const { mode, setMode } = useThemeStore();
    return (
        <DrawerContentScrollView style={{ backgroundColor: theme.colors.background }}>
            <AppStatusBar />
            <DrawerItem
                label="Home"
                labelStyle={{ color: theme.colors.text }}
                onPress={() => navigation.navigate("Tabs", { screen: "Home" })}
            />

            {role === "admin" && (
                <>
                    <DrawerItem label="Schedules" labelStyle={{ color: theme.colors.text }} onPress={() => navigation.navigate("Tabs", { screen: "Schedules" })} />
                    <DrawerItem label="PatientList" labelStyle={{ color: theme.colors.text }} onPress={() => navigation.navigate("Tabs", { screen: "PatientList" })} />
                </>
            )}

            {role === "volunteer" && (
                <DrawerItem label="Tasks" labelStyle={{ color: theme.colors.text }} onPress={() => navigation.navigate("Tabs", { screen: "Tasks" })} />
            )}

            <DrawerItem label="Settings" labelStyle={{ color: theme.colors.text }} onPress={() => navigation.navigate("Settings", { screen: "Settings" })} />
            <DrawerItem label="Help" labelStyle={{ color: theme.colors.text }} onPress={() => navigation.navigate("Help", { screen: "Help" })} />
            <DrawerItem label="certificate" labelStyle={{ color: theme.colors.text }} onPress={() => navigation.navigate("certificate_generation", { screen: "certificate_generation" })} />

            {/* Theme Switcher */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: theme.colors.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ color: theme.colors.text, marginBottom: 8 }}>Dark Mode</Text>
                <Switch
                    value={mode === "dark"}
                    onValueChange={(val) => setMode(val ? "dark" : "light")}
                    thumbColor={mode === "dark" ? "#fff" : "#fff"}
                    trackColor={{ true: "#007AFF", false: "#ccc" }}
                />
            </View>
            <LanguageSwitcher />
            <DrawerItem
                label="Logout"
                labelStyle={{ color: theme.colors.text }}
                onPress={() => {
                    logout();
                    router.replace("/(auth)/login");
                }}
            />
        </DrawerContentScrollView>
    );
}

// Main drawer layout
export default function DrawerLayout() {
    const theme = useTheme();

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: true,
                drawerType: "slide",
                drawerStyle: { backgroundColor: theme.colors.card, width: 250 }
            }}
        >
            <Drawer.Screen
                name="Tabs"
                component={BottomTabs}
                options={{
                    header: ({ navigation }) => (
                        <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
                            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                <Text style={{ fontSize: 24, color: theme.colors.text }}>☰</Text>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 18, color: theme.colors.text, marginLeft: 16 }}>MRC Palliative</Text>
                        </View>
                    )
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingScreen}
                options={{
                    header: ({ navigation }) => (
                        <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
                            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                <Text style={{ fontSize: 24, color: theme.colors.text }}>☰</Text>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 18, color: theme.colors.text, marginLeft: 16 }}>Settings</Text>
                        </View>
                    )
                }}
            />
            <Drawer.Screen
                name="Help"
                component={Help}
                options={{
                    header: ({ navigation }) => (
                        <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
                            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                <Text style={{ fontSize: 24, color: theme.colors.text }}>☰</Text>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 18, color: theme.colors.text, marginLeft: 16 }}>Help</Text>
                        </View>
                    )
                }}
            />
            <Drawer.Screen
                name="certificate_generation"
                component={CertificationGeneration}
                options={{
                    header: ({ navigation }) => (
                        <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
                            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                <Text style={{ fontSize: 24, color: theme.colors.text }}>☰</Text>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 18, color: theme.colors.text, marginLeft: 16 }}>Certificate Generation</Text>
                        </View>
                    )
                }}
            />
        </Drawer.Navigator>
    );
}
