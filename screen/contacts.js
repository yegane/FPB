/* eslint-disable no-unreachable */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    SectionList,
    TouchableOpacity,
    TextInput,
    Image,
    FlatList,
} from 'react-native';
import {Header} from '../components/index';
import SQLite  from 'react-native-sqlite-storage';
let db = SQLite.openDatabase( {name : 'database' , createFromLocation : '~database.db'});
global.initialize = true;

class Contacts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            detailsOfContacts: [],
            arrayHolder: [],
            sections: [],
            isLoading: false,
            searchText: '',
            flag: false,
            obj : null,
            modalVisible: false,
            switchToSearch: 'none',
            switchToList: 'flex',
        };
    }

    initialize = () => {
        this.setState({detailsOfContacts:[],arrayHolder:[],sections:[],isLoading:false});
        let result , length;
        db.transaction((txn) => {
            txn.executeSql('SELECT * FROM contacts ORDER BY fullName' , [] , (tx , res) => {
                if (res.rows.length > 0){
                    for (let i = 0; i < res.rows.length; i++){
                        result = res.rows.item(i);
                        this.state.detailsOfContacts.push(result);
                        this.state.arrayHolder.push(result);

                    if (this.state.sections.length === 0){

                        this.setState({obj : {
                            title: result.title,
                            data: [],
                        }});
                        this.state.obj.data.push(result);
                        this.state.sections.push(this.state.obj);
                    }
                    else {
                        length = this.state.sections.length;
                            if (this.state.sections[length - 1].title === result.title){
                                this.state.sections[length - 1].data.push(result);
                            }
                            else {
                                this.setState({obj : {
                                    title: result.title,
                                    data: [],
                                }});
                                this.state.obj.data.push(result);
                                this.state.sections.push(this.state.obj);
                            }
                    }
                }
                this.setState({isLoading : true});
                }
            });
        });
    };

    UNSAFE_componentWillMount = () => {
        const {navigation} = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            if (global.initialize === true){
                this.initialize();
                global.initialize = false;
            }
        });
    };

    componentWillUnMount = () => {
        this.focusListener.remove();
    };

    renderImage = (img) => {
        const localImage = './user.png';
        return (img !== null ? <Image source={{uri : img}} style={styles.imageContact} resizeMode="cover" /> : <Image source={require(localImage) } style={styles.imageContact} resizeMode="cover" />);
    };

    search = (value) =>{
        if (value !== ''){
            this.setState({switchToList : 'none' , switchToSearch : 'flex' ,searchText:value});
        } else {
            this.setState({switchToList : 'flex' , switchToSearch : 'none' ,searchText:value});
        }
        const newData = this.state.arrayHolder.filter(item =>{
            const itemData = item.fullName.toUpperCase();
            const search = value.toUpperCase();
            return itemData.indexOf(search) > -1;
        });
        this.setState({detailsOfContacts : newData});
    }

    renderContacts() {
        return (
                <SectionList
                    sections={this.state.sections}
                    stickySectionHeadersEnabled={true}
                    renderSectionHeader={ ({section}) => <View style={styles.sectionHeader}><Text style={styles.styleSectionHeader}>{ section.title } </Text></View> }
                    renderItem={({item , index}) => (
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{
                                borderBottomColor: '#ccc',
                                borderBottomWidth: 0.5,
                                marginVertical: 4,
                                marginHorizontal: 12,
                                paddingVertical: 10,
                                flexDirection:'row',
                                marginBottom: 0,
                            }}
                            onPress={() =>
                                this.props.navigation.navigate('DetailsOfContact' , {
                                    key : item.id,
                                    name : item.name,
                                    family : item.family,
                                    phone : item.phone,
                                    mobile: item.mobile,
                                    work: item.work,
                                    favoritePhone: item.favoritePhone,
                                    favoriteMobile: item.favoriteMobile,
                                    favoriteWork: item.favoriteWork,
                                    image : item.image,
                                    index : index,
                                    fullName: item.fullName,
                                })
                            }>
                            <View style={{justifyContent:'center'}}>
                                {this.renderImage(item.image)}
                            </View>

                            <View style={{justifyContent:'center'}}>
                                <Text style={{fontSize: 16,fontFamily:'Ubuntu-Light'}}>{item.name + ' '}{item.family}</Text>
                            </View>

                        </TouchableOpacity>
                    )}
                    keyExtractor={(item , index) => index.toString()}
                />
        );
    }

    renderContentModal = () =>{
        return (
            <FlatList
        data={this.state.detailsOfContacts}
        renderItem={({item , index}) => (
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    borderBottomColor: '#ccc',
                    borderBottomWidth: 0.5,
                    marginVertical: 4,
                    marginHorizontal: 12,
                    paddingVertical: 10,
                    flexDirection:'row',
                    marginBottom: 0,
                }}
                onPress={() =>
                    this.props.navigation.navigate('DetailsOfContact' , {
                        key : item.id,
                        name : item.name,
                        family : item.family,
                        phone : item.phone,
                        mobile: item.mobile,
                        work: item.work,
                        favoritePhone: item.favoritePhone,
                        favoriteMobile: item.favoriteMobile,
                        favoriteWork: item.favoriteWork,
                        image : item.image,
                        index : index,
                        fullName: item.fullName,
                    })
                }>
                <View style={{justifyContent:'center'}}>
                    {this.renderImage(item.image)}
                </View>

                <View style={{justifyContent:'center'}}>
                    <Text style={{fontSize: 16,fontFamily:'Ubuntu-Light'}}>{item.name + ' '}{item.family}</Text>
                </View>

            </TouchableOpacity>
        )}
        keyExtractor={(item , index) => index.toString()}
            />
        );
    }

    render() {
        const {styleMain, styleSearchBox, styleSearchText} = styles;
        if (this.state.isLoading === false) {
            return (
                <View style={styleMain}>
                        <Header navigation={this.props.navigation} title="Contacts" displayIconLeft="none" iconRight="md-add" displayText="none"/>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color="#3D9970" />
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styleMain}>
                        <Header navigation={this.props.navigation} title="Contacts" displayIconLeft="none" iconRight="md-add" displayText="none"/>
                    <View style={[styleSearchBox ]}>
                        <TextInput style={styleSearchText} placeholder="Search contact ..." value={this.state.searchText} onChangeText={(value) => this.search(value)}
                        />
                    </View>
                    <View style={{flex:1 , display:this.state.switchToList}}>{this.renderContacts()}</View>

                    <View style={{flex:1 , display:this.state.switchToSearch}}>{this.renderContentModal()}</View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    styleMain: {
        flex: 1,
    },
    styleTextFlatList: {
        marginTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
    },
    styleSearchBox: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        backgroundColor: 'rgb(238, 244, 228)',
        marginTop: 65,
    },
    styleSearchText: {
        width: '90%',
        padding: 7,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginTop: 10,
        fontFamily: 'Ubuntu-Light',
    },
    imageContact: {
        width: 40,
        height: 40,
        borderRadius: 40,
        justifyContent: 'center',
        marginRight: 10,
    },
    sectionHeader: {
        padding: 10,
        paddingLeft: 15,
        backgroundColor: '#ccc',
    },
    styleSectionHeader: {
        fontFamily: 'Ubuntu-Light',
        fontSize: 15,
        color: '#fff',
    },
    searchBoxModal: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgb(238, 244, 228)',
    },
    closeModal: {
        alignSelf: 'center',
    },
    closeModalText: {
        alignSelf: 'center',
        fontFamily: 'Ubuntu-Light',
    },
});

export {Contacts};
