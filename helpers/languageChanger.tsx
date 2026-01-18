import { i18n } from "@/i18n";
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const languageChanger = () => {

    return (
        <View>
        <Text>{ i18n.t("schedule.new") } </Text>
        < Text > { i18n.t("common.create") } </Text>
        </View>
    )
}

export default languageChanger

const styles = StyleSheet.create({})
