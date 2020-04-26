$(document).ready(function (e)
{
    var json_data = [];

    // Jsonデータの読み込み
    $.getJSON("/json/data.json", function (data)
    {
        json_data = data;

        // 地図データの読み込み
        LoadMapData();

        // 現在のサイズをRWD Image Mapsの基準とする
        $('#map').attr('width', $('#map').width());
        $('#map').attr('height', $('#map').height());

        // jQuery RWD Image Maps 読み込み
        $('#map').rwdImageMaps();

        // 初期は全国データを読み込む
        LoadSocialData(json_data[0]);
    });

    // 地図データの読み込み
    function LoadMapData()
    {
        // 全国ボタンの構築
        $('#btnAll').click(function ()
        {
            LoadSocialData(json_data[0])
        });

        // 都道府県情報の構築
        $.each(json_data, function (json_index, json_value)
        {
            if (json_value["pref_coords"] != "")
            {
                var objArea = $('<area></area>');
                objArea.attr('alt', json_value["pref_name"]);

                // 現在のサイズを基準にイメージマップの座標を再計算
                var defWidth = 840;
                var nowWidth = $('#map').width();
                var coords = "";
                $.each(json_value["pref_coords"].split(","), function (coord_index, coord_value)
                {
                    var cood = coord_value * nowWidth / defWidth;
                    if (coords != "")
                        coords += ",";
                    coords += cood;
                });
                objArea.attr('coords', coords);

                if (json_value["pref_coords"].split(",").length > 4)
                {
                    objArea.attr('shape', 'poly');
                }
                else
                {
                    objArea.attr('shape', 'rect');
                }

                objArea.click(function ()
                {
                    LoadSocialData(json_value)
                });

                $('#ImageMap').append(objArea);
            }
        });
    }

    // ソーシャルリストの読み込み
    function LoadSocialData(pref_data)
    {
        $('#social_title').text(pref_data["pref_name"]);
        $('#loading').css('visibility', 'visible');
        $('#social').empty();

        $.each(pref_data["social_list"], function (social_index, social_value)
        {
            var timeline = $('<li></li>').addClass('timeline');

            $('#social').append(timeline);

            // タイムラインの埋め込み
            // https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/scripting-factory-functions
            twttr.widgets.createTimeline(
                {
                    sourceType: 'profile',
                    screenName: social_value["twitter"]
                },
                timeline[0],
                {
                    showReplies: "hidden",
                    width: '100%',
                    height: '100%',
                    lang: "ja"
                }).then(function (el)
                {
                    $('#loading').css('visibility', 'hidden');
                });
        });
    }
});
