import React, { Component, PropTypes } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Dimensions
} from 'react-native'
import CommonNav from '../components/CommonNav'
import HttpUtils from '../network/HttpUtils'
import BookCollectPage from './BookCollect'
import Round from '../components/Round'
import { BOOKS } from '../network/Urls'
import { INNERWIDTH, WIDTH, HEIGHT } from '../common/styles'
import { Actions } from 'react-native-router-flux'
import { SCENE_BOOK_COLLECT } from '../constants/scene'
import Toast from 'antd-mobile/lib/toast'

const URL = BOOKS.show_detail

export default class BookInfoPage extends Component {
  
  state = {
    show_content: false,
    book_data: { detail_data: [] },
    is_subscribe: false
  }

  static defaultProps = {
    data: {
      book_title: '美洲小宇宙',
      book_content:
      '一本书带你深度探访中南美洲腹地，身未动，心已远。沿着旧地图，走不到新大陆，毕淑敏带你走出自助旅行新路线: “世界最美岛屿”加拉帕戈斯群岛，“热带雾林王冠上的宝石”哥斯达黎加蒙特维德雾林，古印第安人的太阳、月亮金字塔与亡灵大道，全球银饰之都塔斯科，切•格瓦拉故居……太多秘密，等你探索，太多奇迹，等你发现。',
      book_cover:
      'https://imgsa.baidu.com/baike/c0%3Dbaike272%2C5%2C5%2C272%2C90/sign=b52bcf617f094b36cf9f13bfc2a517bc/9c16fdfaaf51f3de300988da9deef01f3b2979d0.jpg',
      book_key: 'TB47-05-/9',
      book_place: '中文文科库(418)',
      book_author: '毕淑敏',
      book_publish: '湖南文艺出版社',
      book_rate: 9.3,
      detail_data: [
        {
          detail_place: '中文文科库418',
          detail_id: 11,
          detail_key: 1,
          detail_in: true
        },
        {
          detail_place: '中文文科库418',
          detail_id: 11,
          detail_key: 2,
          detail_in: true
        },
        {
          detail_place: '中文文科库418',
          detail_id: 11,
          detail_key: 3,
          detail_in: false
        }
      ],
      book_last_number: 2,
      book_subscribe: true
    }
  }

  async componentDidMount() {
    console.log(this.props)
    let params = {
      book_id: this.props.data.book_id,
      book_db_id: this.props.data.book_db_id
    }
    console.log(params)
    let result = await (HttpUtils.post(URL, params) || {})
    if (result.status === 0) {
      this.setState({ book_data: result.data })
    } else {
      Toast.offline(result.msg, 1)
    }
  }

  onNavigator = () => {
    let params = {
      title: '加入书单',
      book: this.props.data
    }
    Actions[SCENE_BOOK_COLLECT](params)
  }

  changeNum(x) {
    if (x < 10) {
      return '0' + x
    } else {
      return x
    }
  }

  subscribe = async () => {
    const message = !this.state.is_subscribe ? '您已成功订阅本书！' : '您已取消订阅！'
    this.setState({ is_subscribe: !this.state.is_subscribe })
    Toast.success(message, 1)
  }

  render() {
    
    let BottomBar = this.renderBottomBar()

    let content = (
      <View style={styles.book_content}>
        <Text style={styles.book_content_font}>
          {this.state.book_data.book_content}
        </Text>
      </View>
    )
    let image_down = require('../../res/images/downArrow.png')
    let image_up = require('../../res/images/upArrow.png')
    let red_dot = require('../../res/images/red_dot.png')
    let blue_dot = require('../../res/images/blue_dot.png')

    return (
      <View style={styles.container}>
        <CommonNav title={'图书详情'} />
        <ScrollView style={styles.scroll_view}>
          <View style={styles.outline_container}>
            <View style={styles.outline_image_view}>
              <Image
                style={styles.outline_image}
                source={{ uri: this.props.data.book_cover }}
              />
            </View>
            <View style={styles.outline_text}>
              <Text style={styles.outline_title}>
                {this.state.book_data.book_title}
              </Text>
              <Text style={styles.outline_a_p}>
                {this.state.book_data.book_author}
              </Text>
              <Text style={styles.outline_a_p}>
                {this.state.book_data.book_publish}
              </Text>
              <Text style={styles.outline_rate}>
                {this.state.book_data.book_rate
                  ? this.state.book_data.book_rate + ' 分'
                  : '暂无评分'}
              </Text>
              <TouchableOpacity
                style={styles.outline_button}
                onPress={() =>
                  this.setState({ show_content: !this.state.show_content })}
              >
                <Text style={styles.outline_button_font}>
                  {this.state.show_content ? '收起详情' : '展开详情'}
                </Text>
                <Image
                  style={styles.outline_button_image}
                  source={this.state.show_content ? image_up : image_down}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.book_c_p_container}>
            {this.state.show_content ? content : <View />}
            <View style={styles.book_position}>
              <View style={styles.book_position_font_container}>
                <Text style={styles.book_position_font}>
                  索书号: {this.state.book_data.book_key}
                </Text>
                <Text style={styles.book_position_font}>
                    {/* @TODO 南昌大学的缺少该参数  */}
                  馆藏地点: {this.state.book_data.book_place}
                </Text>
              </View>
              <View style={styles.book_position_round}>
                <Round data={this.state.book_data.book_last_number} />
              </View>
            </View>
          </View>
          <View style={[styles.book_places_container, styles.scroll_view]}>
            <View style={styles.book_places_cap}>
              <Text style={styles.book_places_cap_number}>序号</Text>
              <Text style={styles.book_places_cap_place}>馆藏地点</Text>
            </View>

            {this.state.book_data.detail_data.map((item, i) => {
              return (
                <View key={i} style={styles.book_place_item}>
                  <Image source={item.is_borrowed ? red_dot : blue_dot} />
                  <Text
                    style={[
                      styles.book_place_item_font,
                      styles.book_place_item_num
                    ]}
                  >
                    {/* @TODO changeNum是什么  */}
                    {/* {this.changeNum(item.id)} */}
                    {item.detail_key}
                  </Text>
                  <Text
                    style={[
                      styles.book_place_item_font,
                      styles.book_place_item_place
                    ]}
                  >
                    {item.detail_place}
                  </Text>
                </View>
              )
            })}
          </View>
        </ScrollView>
        {BottomBar}
      </View>
    )
  }

  renderBottomBar = () => {

    const {
      is_subscribe
    } = this.state

    return (
      <View style={styles.bottom_bar}>
        <TouchableOpacity onPress={this.subscribe}>
          <View style={[styles.subscribe, is_subscribe && styles.subscribe_disbaled ]} >
            <View>
              <Text
                style={[
                  styles.subscribe_font,
                  is_subscribe && styles.subscribe_font_disabled
                ]}
              >
                订阅
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.collect}
          onPress={this.onNavigator}
        >
          <Text style={styles.collect_font}>收藏</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  outline_container: {
    width: INNERWIDTH,
    marginTop: 18,
    flexDirection: 'row'
  },
  outline_image_view: {
    shadowColor: 'gray',
    shadowOffset: { h: 8, w: 8 },
    shadowRadius: 8,
    shadowOpacity: 0.4
  },
  outline_image: {
    width: 106,
    height: 158,
    marginLeft: 8
  },
  outline_text: {
    marginLeft: 20
  },
  outline_title: {
    fontSize: 17,
    fontFamily: 'PingFang SC',
    fontWeight: '500'
  },
  outline_a_p: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'PingFang SC',
    color: '#666666'
  },
  outline_rate: {
    marginTop: 15,
    color: '#FFB173',
    fontSize: 17,
    height: 24
  },
  outline_button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    marginTop: 20
  },
  outline_button_font: {
    fontSize: 14,
    fontFamily: 'PingFang SC',
    color: '#73C0FF',
    marginRight: 8,
    marginBottom: 4,
    height: 20
  },
  outline_button_image: {
    marginTop: -4
  },
  scroll_view: {
    flex: 1,
    paddingBottom: 50
  },
  book_c_p_container: {
    marginTop: 26,
    marginLeft: 8
  },
  book_content: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    width: INNERWIDTH,
    borderRadius: 8
  },
  book_content_font: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'PingFang SC'
  },
  book_position: {
    width: INNERWIDTH,
    height: 88,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    marginTop: 14,
    borderRadius: 8
  },
  book_position_font_container: {
    marginLeft: 16
  },
  book_position_font: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'PingFang SC'
  },
  book_position_round: {
    position: 'absolute',
    right: 12
  },
  book_places_container: {
    width: INNERWIDTH,
    marginLeft: 16,
    marginTop: 20
  },
  book_places_cap: {
    flexDirection: 'row'
  },
  book_places_cap_number: {
    marginLeft: 50,
    color: '#999999',
    fontSize: 12,
    fontFamily: 'PingFang SC'
  },
  book_places_cap_place: {
    marginLeft: 155,
    color: '#999999',
    fontSize: 12,
    fontFamily: 'PingFang SC'
  },
  book_place_item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  book_place_item_font: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'PingFang SC',
    fontWeight: '500'
  },
  book_place_item_num: {
    marginLeft: 34,
    flex: 2
    // width: 40
  },
  book_place_item_place: {
    flex: 5,
    textAlign: 'center'
    // marginLeft: 138
  },
  bottom_bar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0
  },
  subscribe: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: WIDTH * 0.4,
    backgroundColor: '#FFB173'
  },
  subscribe_disbaled: {
    backgroundColor: '#F9F9F9'
  },
  subscribe_font: {
    fontSize: 17,
    color: 'white'
  },
  subscribe_font_disabled: {
    color: '#999999'
  },
  collect: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: WIDTH * 0.6,
    backgroundColor: '#73C0FF'
  },
  collect_font: {
    color: '#FFFFFF',
    fontSize: 17
  }
})
