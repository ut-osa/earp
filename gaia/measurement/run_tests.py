#!/usr/bin/env python
#
# Runs benchmarks in the benchmark app through
# marionette
#
import time
from marionette import Marionette
from marionette import Wait
import unittest
import sys

K = 1024
#blob_sizes = [2*K,4*K,8*K,16*K,32*K,64*K,128*K,256*K,512*K,1024*K]
blob_counts = [1,2,4,10,20,50,100]
#blob_counts = [10]

print_header = True
system = "Earp"

def writeResult(res):
    print '{},{},{},{},{}'.format(res['sys'], res['action'], res['total'],
                                  res['involved'], res['ms'])

def writeHeader():
    if print_header:
        print 'sys,action,total,involved,ms'

class TestContacts(unittest.TestCase):
    def clear(self, elem):
        self.clear_button.tap();
        self.wait.until(lambda m: elem.text == '')

    def waitForResult(self, button_id, res_id):
        self.marionette.find_element('id', button_id).tap()
        res = self.marionette.find_element('id', res_id)
        self.wait.until(lambda m: res.text != '')
        ret = float(res.text)
        self.clear(res)
        return ret


    def setUp(self):
        global print_header
        writeHeader()
        print_header = False
        # Create the client for this session. Assuming you're
        # using the default port on a Marionette instance running locally
        self.marionette = Marionette()
        self.marionette.start_session()
        home_frame = self.marionette.find_element('css selector',
                                                  'div.homescreen iframe')
        self.marionette.switch_to_frame(home_frame)
        self.wait = Wait(self.marionette, timeout=10000, interval=.5)
        benchmarker_icon = self.marionette.find_element('xpath',
                  "//div[@class='icon']//span[contains(text(),'Benchmarker')]")
        benchmarker_icon.tap()

        self.marionette.switch_to_frame()
        Wait(self.marionette).until(lambda m: m.find_element('css selector',
                             "iframe[data-url*='benchmark']").is_displayed())

        benchmarker_frame = self.marionette.find_element('css selector',
                                "iframe[data-url*='benchmark']")
        self.marionette.switch_to_frame(benchmarker_frame)
        time.sleep(2)
        self.clear_button = self.marionette.find_element('id', 'clear')


    def test_all(self):

        self.marionette.find_element('id', 'blobs-clear').tap()
        time.sleep(2);
        self.marionette.find_element('id', 'blobs-number').send_keys(1);
        result = {'total': 100, 'involved': 100}
        result['sys'] = 'Earp';
        for _ in xrange(50):
            result['action'] = 'insertBlobSmall';
            result['ms'] = self.waitForResult('blobs-save-new', 'blobs-result')
            writeResult(result);
        for _ in xrange(50):
            result['action'] = 'readBlobSmall'
            result['ms'] = self.waitForResult('blobs-get-new', 'blobs-result')
            writeResult(result);

        result['sys'] = 'FFOS'
        for _ in xrange(50):
            result['action'] = 'insertBlobSmall';
            result['ms'] = self.waitForResult('blobs-save-orig', 'blobs-result')
            writeResult(result);
        for _ in xrange(50):
            result['action'] = 'insertBlobSmall';
            result['action'] = 'readBlobSmall'
            result['ms'] = self.waitForResult('blobs-get-orig', 'blobs-result')
            writeResult(result);

        result['sys'] = 'Earp'

        self.marionette.find_element('id', 'blobs-clear').tap()
        time.sleep(2);
        for _ in xrange(100):
            result['action'] = 'insertBlobLarge'
            result['ms'] = self.waitForResult('blobs-save-new-big', 'blobs-result')
            writeResult(result);
        for _ in xrange(100):
            result['action'] = 'readBlobLarge'
            result['ms'] = self.waitForResult('blobs-get-new', 'blobs-result')
            writeResult(result);

        result['sys'] = 'FFOS'

        for _ in xrange(100):
            result['action'] = 'insertBlobLarge'
            result['ms'] = self.waitForResult('blobs-save-orig-big', 'blobs-result')
            writeResult(result);
        for _ in xrange(100):
            result['action'] = 'readBlobLarge'
            result['ms'] = self.waitForResult('blobs-get-orig', 'blobs-result')
            writeResult(result);

    def tearDown(self):
        self.marionette.delete_session()

if __name__ == '__main__':
    unittest.main()
