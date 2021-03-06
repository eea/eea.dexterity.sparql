""" Mock http server for testing sparql"""

from __future__ import print_function
from random import randint
import six.moves.BaseHTTPServer
import sys
import os
# from eea.dexterity.sparql.tests.base import ThreadedHTTPServer

PORT = randint(17000, 19000)

from socketserver import ThreadingMixIn


class ThreadedHTTPServer(ThreadingMixIn, six.moves.BaseHTTPServer.HTTPServer):
    """Handle requests in a separate thread."""
    daemon_threads = True


class Handler(six.moves.BaseHTTPServer.BaseHTTPRequestHandler):
    """ Mock http request handler"""

    def do_POST(self):
        """ On post return the contents of sparql.xml file"""
        self.send_response(200)
        self.send_header("Content-type", "application/sparql-results+json")
        self.end_headers()
        stdout = sys.stdout
        sys.stdout = self.wfile
        json_file = os.path.join(os.path.dirname(__file__), "sparql.xml")
        f = open(json_file, 'rb')
        json_str = f.read()
        f.close()
        # in the py2 version we used print json_str in order to get the results
        # in py3 we can no longer do this because of str/bytes str
        # the py3 sockerwriter accepts only bytes in its write function and when
        # we wrap it with the print function, the data is converted to str
        # thus resulting in an error
        # either of the below options is workable in order to write bytes to
        # the socket, unfortunately newlines are not preserved
        sys.stdout.write(json_str)
        # sys.stdout.writelines(json_str.split(b'\n'))
        sys.stdout = stdout

    def do_GET(self):
        """ GET"""
        return self.do_POST()

if __name__ == "__main__":
    httpd = ThreadedHTTPServer(("", PORT), Handler)
    # httpd = six.moves.BaseHTTPServer.ThreadingHTTPServer(("", PORT), Handler)
    httpd.serve_forever()
