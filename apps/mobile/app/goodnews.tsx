//
//
// const GoodNewsAppHome = () => {
//   const setScreenOptions = useSetScreenOptions()
//   const { theme } = useTheme()
//   const { colors } = theme
//   const [activeDate, setActiveDate] = useState<string>()
//
//   useIsomorphicLayoutEffect(() => {
//     setScreenOptions({
//       headerTitle: () => <GoodNewsHeader formattedDate={activeDate} />,
//       headerLeft: () => <HeaderBackButton tintColor={colors.light} fallbackRoute="/" />,
//       headerTintColor: colors.light,
//       headerBackVisible: false,
//       headerTitleAlign: 'center',
//       headerTransparent: true,
//       navigationCustomOptions: {
//         background: { type: 'gradient' },
//         footerShown: false,
//       },
//     })
//   }, [setScreenOptions, colors.light, activeDate])
//
//   return (
//     <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.GOODNEWS} i18nKey="goodnews:maintenance.feature">
//       <View style={{ flex: 1 }} testID={'goodnews-app-home'}>
//         <StatusBar style="light" animated />
//
//         <ScrollViewRefreshable bounces={false} style={{ paddingBottom: 0, backgroundColor: colors.background30 }}>
//           <GoodNewsCarousel onActiveDateChange={setActiveDate} />
//         </ScrollViewRefreshable>
//       </View>
//     </PosthogFeatureFlagGuard>
//   )
// }
//
// export default memo(GoodNewsAppHome)

import GoodNewsAppHome from '@holi-apps/goodnews/screens/GoodNewsAppHome'

export default GoodNewsAppHome
