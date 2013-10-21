function initialize() {
  var youtube = chrome.extension.getBackgroundPage().youtube;
  var options = youtube.getOptions();

  // Polling Interval
  var optionPollingInterval = document.getElementById('option_polling_interval');
  var labelPollingInterval = Util.getFirstElementByClass(optionPollingInterval, 'optionLabel');
  labelPollingInterval.innerHTML = chrome.i18n.getMessage('labelPollingInterval');
  var selectPollingInterval = Util.getFirstElementByClass(optionPollingInterval, 'optionSelect');
  for (var i = YouTube.MIN_POLLING_INTERVAL; i <= YouTube.MAX_POLLING_INTERVAL; ++i) {
    var option = document.createElement('option');
    option.value = i;
    option.text = i;
    selectPollingInterval.appendChild(option);
  }
  selectPollingInterval.value = options['pollingInterval'];
  var labelMetricPollingInterval = Util.getFirstElementByClass(optionPollingInterval, 'optionLabelMetric');
  labelMetricPollingInterval.innerHTML = chrome.i18n.getMessage('labelMinutes');

  // Number of feed items retrieved.
  var optionNumFeedItems = document.getElementById('option_num_feed_items');
  var labelNumFeedItems = Util.getFirstElementByClass(optionNumFeedItems, 'optionLabel');
  labelNumFeedItems.innerHTML = chrome.i18n.getMessage('labelNumFeedItems');
  var selectNumFeedItems = Util.getFirstElementByClass(optionNumFeedItems, 'optionSelect');
  for (var i = 1; i <= YouTube.MAX_NUM_FEED_ITEMS; ++i) {
    var option = document.createElement('option');
    option.value = i;
    option.text = i;
    selectNumFeedItems.appendChild(option);
  }
  selectNumFeedItems.value = options['numFeedItems'];

  // Number of feed items shown.
  var optionNumFeedItemsShown = document.getElementById('option_num_feed_items_shown');
  var labelNumFeedItemsShown = Util.getFirstElementByClass(optionNumFeedItemsShown, 'optionLabel');
  labelNumFeedItemsShown.innerHTML = chrome.i18n.getMessage('labelNumFeedItemsShown');
  var selectNumFeedItemsShown = Util.getFirstElementByClass(optionNumFeedItemsShown, 'optionSelect');
  for (var i = 1; i <= YouTube.MAX_NUM_FEED_ITEMS_SHOWN; ++i) {
    var option = document.createElement('option');
    option.value = i;
    option.text = i;
    selectNumFeedItemsShown.appendChild(option);
  }
  selectNumFeedItemsShown.value = options['numFeedItemsShown'];

  // What does the unread count represent. New items or total unread items?
  var optionUnreadCount = document.getElementById('option_unread_count');
  var labelUnreadCount = Util.getFirstElementByClass(optionUnreadCount, 'optionLabel');
  labelUnreadCount.innerHTML = chrome.i18n.getMessage('labelUnreadCount');
  var selectUnreadCount = Util.getFirstElementByClass(optionUnreadCount, 'optionSelect');
  var optionOnlyNew = document.createElement('option');
  optionOnlyNew.value = 'only_new';
  optionOnlyNew.text = chrome.i18n.getMessage('labelUnreadCountOnlyNew');
  var optionEverything = document.createElement('option');
  optionEverything.value = 'everything';
  optionEverything.text = chrome.i18n.getMessage('labelUnreadCountEverything');
  selectUnreadCount.appendChild(optionOnlyNew);
  selectUnreadCount.appendChild(optionEverything);
  selectUnreadCount.value = options['unreadCount'];

  var openInNewTab = document.getElementById('option_open_in_new_tab');
  var openInNewTabCheckbox = Util.getFirstElementByClass(openInNewTab, 'optionCheckbox');
  var labelOpenInNewTab = Util.getFirstElementByClass(openInNewTab, 'optionLabel');
  labelOpenInNewTab.innerHTML = chrome.i18n.getMessage('labelOpenInNewTab');
  if (options['openInNewTab']) {
    openInNewTabCheckbox.checked = true;
  }

  var titleWhichFeedTypes = document.getElementById('title_which_feed_types');
  titleWhichFeedTypes.innerHTML = chrome.i18n.getMessage('titleWhichFeedTypes');
  var feedTypes = ['load_friend_feed', 'load_subscription_feed'];
  for (var i = 0; i < feedTypes.length; ++i) {
    var feedType = feedTypes[i];
    var optionDiv = document.getElementById('option_' + feedType);
    var label = Util.getFirstElementByClass(optionDiv, 'optionLabel');
    label.innerHTML = chrome.i18n.getMessage('label_' + feedType);
    if (options[feedType]) {
      var checkboxFeedType = Util.getFirstElementByClass(optionDiv, 'optionCheckbox');
      checkboxFeedType.checked = true;
    }
  }

  var titleWhichEventTypes = document.getElementById('title_which_event_types');
  titleWhichEventTypes.innerHTML = chrome.i18n.getMessage('titleWhichEventTypes');
  var eventTypes = ['video_uploaded', 'video_favorited', 'video_liked', 'video_rated', 'video_commented'];
  for (var i = 0; i < eventTypes.length; ++i) {
    var eventType = eventTypes[i];
    var optionDiv = document.getElementById('option_' + eventType);
    var label = Util.getFirstElementByClass(optionDiv, 'optionLabel');
    label.innerHTML = chrome.i18n.getMessage('label_' + eventType);
    if (options[eventType]) {
      var checkboxEventType = Util.getFirstElementByClass(optionDiv, 'optionCheckbox');
      checkboxEventType.checked = true;
    }
  }

  var saveButton = document.getElementById('save_options');
  saveButton.innerHTML = chrome.i18n.getMessage('buttonSave');
  saveButton.addEventListener('mousedown', function() {
    if (selectPollingInterval.value <= 0 ||
      selectPollingInterval.value > YouTube.MAX_POLLING_INTERVAL) {
      var placeholders = [
        chrome.i18n.getMessage('labelPollingInterval'),
        1, YouTube.MAX_POLLING_INTERVAL
      ];
      setMessage('errorMessage',
          chrome.i18n.getMessage('errorInvalidOptionValue',
          placeholders));
      return;
    }
    if (selectNumFeedItems <= 0 &&
      selectNumFeedItems.value > YouTube.MAX_NUM_FEED_ITEMS) {
      var placeholders = [
        chrome.i18n.getMessage('labelNumFeedItems'),
        1, YouTube.MAX_NUM_FEED_ITEMS
      ];
      setMessage('errorMessage',
          chrome.i18n.getMessage('errorInvalidOptionValue',
          placeholders));
      return;
    }
    if (selectNumFeedItemsShown <= 0 &&
        selectNumFeedItemsShown.value > YouTube.MAX_NUM_FEED_ITEMS_SHOWN) {
      var placeholders = [
        chrome.i18n.getMessage('labelNumFeedItemsShown'),
        1, YouTube.MAX_NUM_FEED_ITEMS_SHOWN
      ];
      setMessage('errorMessage',
          chrome.i18n.getMessage('errorInvalidOptionValue',
          placeholders));
      return;
    }
    var validUnreadCountValues = {
      'only_new': true,
      'everything': true,
    }
    if (!validUnreadCountValues[selectUnreadCount.value]) {
      var placeholders = [
        chrome.i18n.getMessage('labelUnredCount'),
        chrome.i18n.getMessage('labelUnreadCountOnlyNew'),
        chrome.i18n.getMessage('labelUnreadCountEverything')
      ];
      setMessage('errorMessage',
          chrome.i18n.getMessage('errorInvalidOptionValue',
          placeholders));
      return;
    }
    setMessage('successMessage', chrome.i18n.getMessage('messageSavedOptions'));

    var newOptions = {
        'pollingInterval': parseInt(selectPollingInterval.value),
        'numFeedItems': parseInt(selectNumFeedItems.value),
        'numFeedItemsShown': parseInt(selectNumFeedItemsShown.value),
        'unreadCount': selectUnreadCount.value,
    };

    for (var i = 0; i < feedTypes.length; ++i) {
      var feedType = feedTypes[i];
      var optionDiv = document.getElementById('option_' + feedType);
      var checkboxFeedType = Util.getFirstElementByClass(optionDiv, 'optionCheckbox');
      if (checkboxFeedType.checked) {
        newOptions[feedType] = true;
      } else {
        newOptions[feedType] = false;
      }
    }

    for (var i = 0; i < eventTypes.length; ++i) {
      var eventType = eventTypes[i];
      var optionDiv = document.getElementById('option_' + eventType);
      var checkboxEventType = Util.getFirstElementByClass(optionDiv, 'optionCheckbox');
      if (checkboxEventType.checked) {
        newOptions[eventType] = true;
      } else {
        newOptions[eventType] = false;
      }
    }

    if (openInNewTabCheckbox.checked) {
      newOptions['openInNewTab'] = true;
    } else {
      newOptions['openInNewTab'] = false;
    }

    youtube.saveOptions(newOptions);
    youtube.startPolling();
    youtube.setVisualState();
  });
}

function setMessage(messageTypeClass, messageText) {
  var messageDiv = document.getElementById('message');
  var saveButton = document.getElementById('save_options');

  saveButton.disabled = true;
  messageDiv.className = messageTypeClass;
  window.setTimeout(function() {
    messageDiv.innerHTML = messageText;
    messageDiv.style.display = 'block';
  }, 1000);
  window.setTimeout(function() {
    messageDiv.innerHTML = '';
    messageDiv.style.display = 'none';
    saveButton.disabled = '';

  }, 5000);
}

initialize();