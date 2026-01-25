import { usePatients } from "@/hooks/usePatients";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export const PatientDropdown = ({ value, onSelect }: any) => {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [selectedValue, setSelectedValue] = useState(value?._id || null);
    const theme = useTheme();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePatients(search);

    // Flatten pages into dropdown items
    useEffect(() => {
        const patients = data?.pages.flatMap((p: any) => p.data) ?? [];
        setItems(
            patients.map((p: any) => ({
                label: p.name,
                value: p._id,
                data: p, // keep full patient object
            }))
        );
    }, [data]);


    return (
        <View style={{ zIndex: 1000 }}>
            <DropDownPicker
                open={open}
                setOpen={setOpen}
                value={selectedValue || value?._id}
                setValue={setSelectedValue}
                items={items}
                setItems={setItems}
                searchable={true}
                multiple={false}
                // searchValue={search}
                // sear
                // setSearchValue={setSearch}
                placeholder="Select patient..."
                onSelectItem={(item: any) => {
                    console.log(item?.data);
                    onSelect(item?.data)
                }}
                listMode="SCROLLVIEW"
                // scrollViewProps={{
                //     onEndReached: () => hasNextPage && fetchNextPage(),
                // }}
                loading={isFetchingNextPage}
                zIndex={1000}
                style={{
                    borderColor: theme?.colors.border,
                    borderRadius: 10,
                    backgroundColor: theme?.colors.card,

                }}
                dropDownContainerStyle={{
                    backgroundColor: theme?.colors.background,
                    borderRadius: 10,

                }}
                textStyle={{ color: theme?.colors.text }}
                placeholderStyle={{ color: theme?.colors.text }}
                searchContainerStyle={{
                    borderBottomColor: theme?.colors.border,
                }}
                searchTextInputStyle={{
                    color: theme?.colors.text,
                    borderColor: theme?.colors.border,
                }}
            />
        </View>
    );
};
