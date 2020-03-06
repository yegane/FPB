/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Animated,
    TouchableOpacity,
    Image,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import SQLite from 'react-native-sqlite-storage';
import {Header} from '../components/index';
import Icon from 'react-native-vector-icons/Ionicons';
const {Value} = Animated;
let db = SQLite.openDatabase( {name : 'database' , createFromLocation : '~database.db'});

class AddContact extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            FirstName : '',
            LastName : '',
            fullName: '',
            FirstLetterOfFirstName : '',
            FirstLetterOfLastName : '',
            backgroundColor : 'rgba(0,0,0,.2)',
            phone : '',
            mobile: '',
            work: '',
            favoritePhone: false,
            favoriteMobile: false,
            favoriteWork: false,
            scrollY : new Value(0),
            avatarSource : null,
            disable : true,
            addMobile: false,
            addWork : false,
            title: '',
        };
    }

    FirstLetterOfFirstName=(value)=>{
        this.setState({FirstName:value , FirstLetterOfFirstName : value.charAt(0).toUpperCase(), title:value.charAt(0).toUpperCase()});
        if (value === ''){
            this.setState({backgroundColor:'rgba(0,0,0,.2)'});
        } else {
            this.setState({backgroundColor:'rgb(255,255,255)' , disable : false});
        }
    };

    FirstLetterOfLastName =(value)=>{
        this.setState({LastName: value, FirstLetterOfLastName: value.charAt(0).toUpperCase()});
        if (value === ''){
            this.setState({backgroundColor:'rgba(0,0,0,.2)'});
        } else {
            this.setState({backgroundColor:'rgb(255,255,255)' , disable : false});
        }
    };

    PhoneContact =(value)=>{
        this.setState({phone:value , disable : false , backgroundColor:'rgb(255,255,255)'});
    };

    mobileContact =(value)=>{
        this.setState({mobile:value , disable : false , backgroundColor:'rgb(255,255,255)'});
    };

    workContact =(value)=>{
        this.setState({work:value , disable : false , backgroundColor:'rgb(255,255,255)'});
    };

    addPhone = () => {
        this.state.addMobile === false ? this.setState({addMobile : true}) : this.setState({addWork : true});
    };

    removePhone = (value) => {
         value === 'mobile' ? this.setState({addMobile : false , mobile : ''}) : this.setState({addWork : false , work : ''});
    };

    SaveContact = () => {
        if ( (this.state.FirstName !== '' || this.state.LastName !== '' ) && ( this.state.phone !== '' || this.state.mobile !== '' || this.state.work !== '' )){
            this.setState({fullName : this.state.FirstName.toUpperCase().replace(/\s+/g, '').concat(this.state.LastName.toUpperCase().replace(/\s+/g, '')) , disable: true});
            db.transaction((txn) => {
               txn.executeSql('CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), family VARCHAR(20), phone VARCHAR(11), mobile VARCHAR(11) , work VARCHAR(11) , favoritePhone INTEGER , favoriteMobile INTEGER , favoriteWork INTEGER , image VARCHAR(100), fullName VARCHAR(100), title VARCHAR(1))' , [] , (tx , res) => {
                   txn.executeSql('INSERT INTO contacts (name , family , phone , mobile , work , favoritePhone , favoriteMobile , favoriteWork , image , fullName , title) VALUES (?,?,?,?,?,?,?,?,?,?,?)' , [this.state.FirstName , this.state.LastName , this.state.phone , this.state.mobile , this.state.work , this.state.favoritePhone , this.state.favoriteMobile , this.state.favoriteWork , this.state.avatarSource , this.state.fullName, this.state.title] , (tx2 , results)=>{
                       if (results.rowsAffected > 0){
                           global.initialize = true;
                           this.props.navigation.navigate('Contacts');
                       }
                   });
               });
            });
        } else {
            this.setState({disable : false});
            alert('Please insert name or lastName and phone');
        }
    };

    goBack = () =>{
        global.flagBack = 'false';
        this.props.navigation.navigate('Contacts');
    };



    Layout = (event) =>{
        this.setState({heightPhoto : event.nativeEvent.layout.height , translateY : event.nativeEvent.layout.y} );
    };

    selectImage = async () => {
        const options = {
            title : 'Select image',
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({
                    avatarSource: response.uri,
                });
            }
        });
    };

    render(){

        const interpolateScale = this.state.scrollY.interpolate({
            inputRange:[0,115],
            outputRange:[1,0.5],
            extrapolate : 'clamp',
        });

        const interpolateY = this.state.scrollY.interpolate({
            inputRange :[0,115],
            outputRange : [0 , -100],
            extrapolate:'clamp',
        });

        const interpolateYImage = this.state.scrollY.interpolate({
            inputRange :[0,115],
            outputRange : [0,  120],
            extrapolate:'clamp',
        });

        const interpolateOpacityText = this.state.scrollY.interpolate({
            inputRange:[0,15],
            outputRange:[1,0],
            extrapolate:'clamp',
        });

        const {styleMain , stylePhoto , photo , image , styleImage , styleTextPhoto , styleInformation , subject, textInput , addPhone , iconAddPhone , viewOtherPhone , iconRemove} = styles;
        return (
            <View style={styleMain} >
                <Header navigation={this.props.navigation} title="New Contact" iconLeft="md-arrow-back" nameRight="Done" displayIconRight="none" iconRight="md-add" colorText={this.state.backgroundColor} update={this.SaveContact} disable={this.state.disable} />

            <View style={[styleMain , {marginTop:65}]}>
                <Animated.View onLayout={e => this.Layout(e)} style={[ stylePhoto, { transform :[{translateY: interpolateY}] }]} >

                    <Animated.View style={[photo , { transform : [{scale : interpolateScale , translateY: interpolateYImage}] }]} >
                        <Image source={{uri : this.state.avatarSource}} style={image} />
                        <Text style={styleImage}>{this.state.FirstLetterOfFirstName}{this.state.FirstLetterOfLastName}</Text>
                    </Animated.View>

                    <TouchableOpacity onPress={() => this.selectImage()}>
                        <Animated.Text style={[styleTextPhoto , {opacity : interpolateOpacityText}]}>Add Photo</Animated.Text>
                    </TouchableOpacity>

                </Animated.View>
                <Animated.ScrollView style={{flex:1}}  contentContainerStyle={{paddingTop:this.state.heightPhoto , width : '100%' , position:'absolute' , zIndex:2}}  scrollEventThrottle={32} onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {contentOffset: {y: this.state.scrollY}},
                        },
                    ],{
                        useNativeDriver:true,
                    }
                )}>
                    <View style={[styleInformation]}>
                    <Text style={subject}>first Name</Text>
                    <TextInput
                    placeholder="Name"
                        value={this.state.FirstName}
                        onChangeText={value => this.FirstLetterOfFirstName(value)}
                        style={textInput}
                    />
                    <Text style={subject}>Family</Text>
                    <TextInput
                        placeholder="Family"
                        value={this.state.LastName}
                        onChangeText={value => this.FirstLetterOfLastName(value)}
                        style={textInput}
                    />
                    <Text style={subject}>Phone</Text>
                     <TextInput
                        placeholder="Phone"
                        value={this.state.phone.toString()}
                        onChangeText={value => this.PhoneContact(value)}
                        style={[textInput , {marginTop : 15}]}
                        keyboardType="numeric"
                    />
                    {this.state.addMobile && <View style={[viewOtherPhone]}>
                    <TextInput
                        placeholder="Mobile"
                        value={this.state.mobile.toString()}
                        onChangeText={value => this.mobileContact(value)}
                        style={[textInput , {marginTop : 15}]}
                        keyboardType="numeric"
                    />
                    <Icon name="ios-remove-circle" size={25} color="#FF5733" style={iconRemove} onPress={()=>this.removePhone('mobile')} />
                    </View>}
                    {this.state.addWork && <View style={[viewOtherPhone]}>
                    <TextInput
                        placeholder="Work"
                        value={this.state.work.toString()}
                        onChangeText={value => this.workContact(value)}
                        style={[textInput , {marginTop : 15}]}
                        keyboardType="numeric"
                    />
                    <Icon name="ios-remove-circle" size={25} color="#FF5733" style={iconRemove} onPress={()=>this.removePhone('work')} />
                    </View>}
                    <TouchableOpacity onPress={() => this.addPhone()} activeOpacity={1} style={{flexDirection:'row',alignItems:'center',marginTop:15,marginBottom:15}}>
                        <Icon name="ios-add" size={25} color="#3a393c" style={iconAddPhone}  />
                        <Text style={addPhone}>Add phone</Text>
                    </TouchableOpacity>
                    </View>
                </Animated.ScrollView>
                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({

    styleMain :{
        flex:1,
    },
    stylePhoto : {
        position:'absolute' ,
        zIndex: 3,
        width : '100%' ,
        left :0 ,
        alignItems:'center',
        padding:10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1 ,
        backgroundColor:'#EEF4E4',
    },
    photo : {
        backgroundColor:'#ccc',
        justifyContent:'center',
        alignItems: 'center',
        width : 140 ,
        height : 140 ,
        borderRadius : 140,
    },
    image : {
        resizeMode:'cover',
        width : 140 ,
        height : 140 ,
        borderRadius : 140 ,
        position: 'absolute',
        zIndex: 5,
    },
    styleTextPhoto : {
        marginTop: 10,
        fontFamily : 'Ubuntu-Light',
    },
    styleInformation : {
        flex:1,
    },
    subject: {
        fontFamily: 'Ubuntu-Light',
        fontSize: 18,
        padding: 15,
      },
      textInput: {
        paddingLeft: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: '90%',
        alignSelf: 'center',
        fontFamily: 'Ubuntu-Light',
        fontSize: 15,
      },
    styleImage : {
        color:'#fff',
        fontSize :60,
    },
    iconAddPhone: {
        marginLeft: 15,
        backgroundColor: '#5ec094',
        width: 25,
        height: 25,
        borderRadius: 25,
        textAlign: 'center',
    },
    addPhone: {
        fontFamily: 'Ubuntu-Light',
        fontSize: 15,
        marginLeft: 15,
    },
    viewOtherPhone: {
        width:'90%',
        flexDirection:'row',
        alignSelf:'center',
        justifyContent:'space-between',
    },
    iconRemove: {
        alignSelf:'center',
        marginTop:15,
    },

});

export {AddContact};
